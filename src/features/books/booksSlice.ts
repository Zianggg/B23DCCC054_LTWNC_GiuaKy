import { createAsyncThunk, createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchBooksApi, type FetchBooksOptions } from '../../api/booksApi';
import { isApiSuccess } from '../../types/api';
import type { Book, BooksState, BorrowedBook } from './types';

export const MAX_BORROW = 3;

export const initialState: BooksState = {
  items: [],
  borrowedIds: [],
  status: 'idle',
  error: null,
  warning: null,
};

type BooksRootState = { books: BooksState };

export const fetchBooks = createAsyncThunk<
  Book[],
  FetchBooksOptions | undefined,
  { state: BooksRootState; rejectValue: string }
>(
  'books/fetchBooks',
  async (options, { rejectWithValue }) => {
    const res = await fetchBooksApi(options);
    if (isApiSuccess(res)) return res.data;
    return rejectWithValue(res.error);
  },
  {
    // Không gọi lại khi đang tải (tránh gọi 2 lần trong StrictMode)
    condition: (_options, { getState }) => getState().books.status !== 'loading',
  },
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    borrowBook(state, action: PayloadAction<string>) {
      const book = state.items.find((item) => item.id === action.payload);
      if (!book || book.available <= 0 || state.borrowedIds.includes(book.id)) return;
      book.available -= 1;
      state.borrowedIds.push(book.id);
      state.warning = null;
    },
    returnBook(state, action: PayloadAction<string>) {
      if (!state.borrowedIds.includes(action.payload)) return;
      const book = state.items.find((item) => item.id === action.payload);
      if (book) book.available += 1;
      state.borrowedIds = state.borrowedIds.filter((id) => id !== action.payload);
      state.warning = null;
    },
    borrowRejected(state, action: PayloadAction<string>) {
      state.warning = action.payload;
    },
    dismissWarning(state) {
      state.warning = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Đã xảy ra lỗi không xác định';
      });
  },
});

export const { borrowBook, returnBook, borrowRejected, dismissWarning } = booksSlice.actions;
export default booksSlice.reducer;

// Selectors
export const selectBooks = (state: BooksRootState) => state.books.items;
export const selectBorrowedIds = (state: BooksRootState) => state.books.borrowedIds;
export const selectBooksStatus = (state: BooksRootState) => state.books.status;
export const selectBooksError = (state: BooksRootState) => state.books.error;
export const selectWarning = (state: BooksRootState) => state.books.warning;

export const selectBorrowedBooks = createSelector(
  [selectBooks, selectBorrowedIds],
  (books, ids): BorrowedBook[] =>
    ids.flatMap((id) => {
      const book = books.find((item) => item.id === id);
      return book
        ? [{ id: book.id, title: book.title, author: book.author, category: book.category }]
        : [];
    }),
);
