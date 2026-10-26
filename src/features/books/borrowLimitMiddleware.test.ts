import { setupStore } from '../../app/store';
import { makeBook, makeBooksState } from '../../test/test-utils';
import { borrowBook, returnBook } from './booksSlice';
import { BORROW_LIMIT_MESSAGE } from './borrowLimitMiddleware';

const items = ['b1', 'b2', 'b3', 'b4'].map((id) => makeBook({ id, available: 2 }));

describe('borrowLimitMiddleware', () => {
  it('cho mượn khi chưa đủ 3 cuốn', () => {
    const store = setupStore({ books: makeBooksState({ items }) });
    store.dispatch(borrowBook('b1'));
    store.dispatch(borrowBook('b2'));
    store.dispatch(borrowBook('b3'));
    expect(store.getState().books.borrowedIds).toEqual(['b1', 'b2', 'b3']);
    expect(store.getState().books.warning).toBeNull();
  });

  it('chặn cuốn thứ 4 và hiện cảnh báo, số bản không đổi', () => {
    const store = setupStore({ books: makeBooksState({ items, borrowedIds: ['b1', 'b2', 'b3'] }) });
    store.dispatch(borrowBook('b4'));
    const { books } = store.getState();
    expect(books.borrowedIds).toHaveLength(3);
    expect(books.items.find((b) => b.id === 'b4')?.available).toBe(2);
    expect(books.warning).toBe(BORROW_LIMIT_MESSAGE);
  });

  it('trả bớt 1 cuốn thì mượn được tiếp và xoá cảnh báo', () => {
    const store = setupStore({
      books: makeBooksState({ items, borrowedIds: ['b1', 'b2', 'b3'], warning: BORROW_LIMIT_MESSAGE }),
    });
    store.dispatch(returnBook('b1'));
    store.dispatch(borrowBook('b4'));
    expect(store.getState().books.borrowedIds).toEqual(['b2', 'b3', 'b4']);
    expect(store.getState().books.warning).toBeNull();
  });
});
