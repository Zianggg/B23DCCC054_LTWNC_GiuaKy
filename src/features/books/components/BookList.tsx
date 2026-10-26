import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useFilterStore } from '../../filters/useFilterStore';
import { borrowBook, returnBook, selectBooks, selectBorrowedIds } from '../booksSlice';
import { filterBooks } from '../filterBooks';
import { BookItem } from './BookItem';

export function BookList() {
  const dispatch = useAppDispatch();
  const books = useAppSelector(selectBooks);
  const borrowedIds = useAppSelector(selectBorrowedIds);
  const keyword = useFilterStore((s) => s.keyword);
  const category = useFilterStore((s) => s.category);

  const filtered = useMemo(() => filterBooks(books, keyword, category), [books, keyword, category]);
  const borrowedSet = useMemo(() => new Set(borrowedIds), [borrowedIds]);

  const handleBorrow = useCallback((id: string) => {
    dispatch(borrowBook(id));
  }, [dispatch]);

  const handleReturn = useCallback((id: string) => {
    dispatch(returnBook(id));
  }, [dispatch]);

  if (filtered.length === 0) {
    return <p className="empty">Không tìm thấy sách phù hợp.</p>;
  }

  return (
    <>
      <p className="result-count">Tìm thấy {filtered.length} đầu sách</p>
      <ul className="book-grid">
        {filtered.map((book) => (
          <BookItem
            key={book.id}
            book={book}
            isBorrowed={borrowedSet.has(book.id)}
            onBorrow={handleBorrow}
            onReturn={handleReturn}
          />
        ))}
      </ul>
    </>
  );
}
