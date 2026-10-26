import type { ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchBooks, selectBooksError, selectBooksStatus } from '../booksSlice';

/** Hiển thị "Đang tải..." / lỗi; khi dữ liệu sẵn sàng mới render children. */
export function BooksStatusGate({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectBooksStatus);
  const error = useAppSelector(selectBooksError);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="state" role="status">
        <span className="spinner" aria-hidden="true" />
        Đang tải...
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="state state-error" role="alert">
        <p>{error}</p>
        <button type="button" className="btn btn-primary" onClick={() => dispatch(fetchBooks())}>
          Thử lại
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
