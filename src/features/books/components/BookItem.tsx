import { memo } from 'react';
import { CATEGORY_TONE } from '../categoryMeta';
import type { Book } from '../types';

export interface BookItemProps {
  book: Book;
  isBorrowed: boolean;
  onBorrow: (id: string) => void;
  onReturn: (id: string) => void;
}

function BookItemBase({ book, isBorrowed, onBorrow, onReturn }: BookItemProps) {
  const outOfStock = book.available === 0;

  return (
    <li className={`book-card${isBorrowed ? ' is-borrowed' : ''}`} data-testid="book-item">
      <div className="book-card-top">
        <span className={`tag tag-${CATEGORY_TONE[book.category]}`}>{book.category}</span>
        <span className="book-year">{book.year}</span>
      </div>

      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">{book.author}</p>

      <div className="book-card-bottom">
        <p className={`book-stock${outOfStock ? ' is-empty' : ''}`}>
          Còn lại: <strong>{book.available}</strong>/{book.total}
          {outOfStock && <span className="stock-badge">Hết sách</span>}
        </p>

        {isBorrowed ? (
          <button type="button" className="btn btn-secondary" onClick={() => onReturn(book.id)}>
            Trả
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onBorrow(book.id)}
            disabled={outOfStock}
          >
            Mượn
          </button>
        )}
      </div>
    </li>
  );
}

/** Bọc React.memo: chỉ re-render khi book/isBorrowed/handler đổi. */
export const BookItem = memo(BookItemBase);
