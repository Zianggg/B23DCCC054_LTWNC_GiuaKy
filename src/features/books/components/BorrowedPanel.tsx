import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { MAX_BORROW, returnBook, selectBorrowedBooks } from '../booksSlice';

export function BorrowedPanel() {
  const dispatch = useAppDispatch();
  const borrowed = useAppSelector(selectBorrowedBooks);

  return (
    <aside className="panel" aria-label="Sách đang mượn">
      <div className="panel-head">
        <h2>Sách đang mượn</h2>
        <span className={`count-pill${borrowed.length >= MAX_BORROW ? ' is-full' : ''}`}>
          {borrowed.length}/{MAX_BORROW}
        </span>
      </div>

      {borrowed.length === 0 ? (
        <p className="panel-empty">Bạn chưa mượn cuốn nào.</p>
      ) : (
        <ul className="borrowed-list">
          {borrowed.map((book) => (
            <li key={book.id}>
              <div>
                <p className="borrowed-title">{book.title}</p>
                <p className="borrowed-author">{book.author}</p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => dispatch(returnBook(book.id))}
                aria-label={`Trả sách ${book.title}`}
              >
                Trả
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
