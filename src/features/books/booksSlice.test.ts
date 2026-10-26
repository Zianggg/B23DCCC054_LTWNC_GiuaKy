import { makeBook, makeBooksState } from '../../test/test-utils';
import reducer, {
  borrowBook,
  borrowRejected,
  dismissWarning,
  fetchBooks,
  initialState,
  returnBook,
  selectBorrowedBooks,
} from './booksSlice';

describe('booksSlice reducer', () => {
  it('trả về state khởi tạo khi nhận action lạ', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchBooks (createAsyncThunk)', () => {
    it('pending: chuyển sang loading và xoá lỗi cũ', () => {
      const state = reducer(
        { ...initialState, status: 'failed', error: 'Lỗi cũ' },
        fetchBooks.pending('req-1', undefined),
      );
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('fulfilled: lưu danh sách sách và chuyển sang succeeded', () => {
      const books = [makeBook(), makeBook({ id: 'b2', title: 'Marketing căn bản', category: 'Kinh tế' })];
      const state = reducer(
        { ...initialState, status: 'loading' },
        fetchBooks.fulfilled(books, 'req-1', undefined),
      );
      expect(state.status).toBe('succeeded');
      expect(state.items).toEqual(books);
    });

    it('rejected: lưu thông báo lỗi từ rejectWithValue', () => {
      const state = reducer(
        { ...initialState, status: 'loading' },
        fetchBooks.rejected(null, 'req-1', undefined, 'API lỗi'),
      );
      expect(state.status).toBe('failed');
      expect(state.error).toBe('API lỗi');
    });
  });

  describe('borrowBook', () => {
    it('giảm số bản còn lại 1 và thêm vào danh sách đang mượn', () => {
      const start = makeBooksState({ items: [makeBook({ id: 'b1', available: 3 })] });
      const state = reducer(start, borrowBook('b1'));
      expect(state.items[0].available).toBe(2);
      expect(state.borrowedIds).toEqual(['b1']);
    });

    it('không làm gì khi sách đã hết bản', () => {
      const start = makeBooksState({ items: [makeBook({ id: 'b1', available: 0 })] });
      const state = reducer(start, borrowBook('b1'));
      expect(state.items[0].available).toBe(0);
      expect(state.borrowedIds).toEqual([]);
    });

    it('không mượn trùng 1 cuốn đang mượn', () => {
      const start = makeBooksState({
        items: [makeBook({ id: 'b1', available: 2 })],
        borrowedIds: ['b1'],
      });
      const state = reducer(start, borrowBook('b1'));
      expect(state.items[0].available).toBe(2);
      expect(state.borrowedIds).toEqual(['b1']);
    });

    it('bỏ qua id không tồn tại', () => {
      const start = makeBooksState({ items: [makeBook()] });
      expect(reducer(start, borrowBook('khong-co'))).toEqual(start);
    });
  });

  describe('returnBook', () => {
    it('tăng số bản còn lại 1 và bỏ khỏi danh sách đang mượn', () => {
      const start = makeBooksState({
        items: [makeBook({ id: 'b1', available: 2 })],
        borrowedIds: ['b1'],
      });
      const state = reducer(start, returnBook('b1'));
      expect(state.items[0].available).toBe(3);
      expect(state.borrowedIds).toEqual([]);
    });

    it('không đổi gì khi trả cuốn chưa mượn', () => {
      const start = makeBooksState({ items: [makeBook({ id: 'b1', available: 2 })] });
      expect(reducer(start, returnBook('b1'))).toEqual(start);
    });
  });

  it('borrowRejected đặt cảnh báo, dismissWarning xoá cảnh báo', () => {
    const warned = reducer(initialState, borrowRejected('Quá giới hạn'));
    expect(warned.warning).toBe('Quá giới hạn');
    expect(reducer(warned, dismissWarning()).warning).toBeNull();
  });

  it('selectBorrowedBooks trả về thông tin rút gọn theo thứ tự mượn', () => {
    const books = makeBooksState({
      items: [makeBook({ id: 'b1' }), makeBook({ id: 'b2', title: 'Design Patterns' })],
      borrowedIds: ['b2', 'b1'],
    });
    expect(selectBorrowedBooks({ books }).map((b) => b.title)).toEqual(['Design Patterns', 'Clean Code']);
  });
});
