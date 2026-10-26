import type { Middleware } from '@reduxjs/toolkit';
import { borrowBook, borrowRejected, MAX_BORROW } from './booksSlice';
import type { BooksState } from './types';

export const BORROW_LIMIT_MESSAGE = `Bạn chỉ được mượn tối đa ${MAX_BORROW} cuốn cùng lúc. Hãy trả bớt sách trước khi mượn thêm.`;

/**
 * Middleware tự viết: chặn action `books/borrowBook` khi sinh viên đã mượn đủ MAX_BORROW cuốn.
 * Action bị chặn không tới reducer; thay vào đó dispatch `borrowRejected` để hiện cảnh báo.
 */
export const borrowLimitMiddleware: Middleware<object, { books: BooksState }> =
  (store) => (next) => (action) => {
    if (borrowBook.match(action)) {
      const { borrowedIds } = store.getState().books;
      const alreadyBorrowed = borrowedIds.includes(action.payload);
      if (!alreadyBorrowed && borrowedIds.length >= MAX_BORROW) {
        return store.dispatch(borrowRejected(BORROW_LIMIT_MESSAGE));
      }
    }
    return next(action);
  };
