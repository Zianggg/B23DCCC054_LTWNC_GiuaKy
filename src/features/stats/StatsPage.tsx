import { useMemo } from 'react';
import { useAppSelector } from '../../app/hooks';
import { MAX_BORROW, selectBooks, selectBorrowedBooks } from '../books/booksSlice';
import { BooksStatusGate } from '../books/components/BooksStatusGate';
import { CATEGORY_TONE } from '../books/categoryMeta';
import { CATEGORIES } from '../books/types';
import { countByCategory } from './statsUtils';

function StatsContent() {
  const books = useAppSelector(selectBooks);
  const borrowed = useAppSelector(selectBorrowedBooks);

  const stats = useMemo(() => countByCategory(books), [books]);
  const availableCopies = useMemo(() => books.reduce((sum, b) => sum + b.available, 0), [books]);
  const maxCount = Math.max(1, ...CATEGORIES.map((c) => stats[c]));

  return (
    <>
      <div className="stat-cards">
        <div className="stat-card">
          <p className="stat-label">Tổng đầu sách</p>
          <p className="stat-value">{books.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Sách đang mượn</p>
          <p className="stat-value" data-testid="borrowed-count">
            {borrowed.length}
            <span className="stat-sub">/{MAX_BORROW}</span>
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Bản còn trên kệ</p>
          <p className="stat-value">{availableCopies}</p>
        </div>
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2>Số đầu sách theo thể loại</h2>
        </div>
        <ul className="bars">
          {CATEGORIES.map((category) => (
            <li key={category}>
              <span className="bar-label">{category}</span>
              <span className="bar-track">
                <span
                  className={`bar-fill bar-${CATEGORY_TONE[category]}`}
                  style={{ width: `${(stats[category] / maxCount) * 100}%` }}
                />
              </span>
              <span className="bar-value">{stats[category]}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Danh sách đang mượn</h2>
        </div>
        {borrowed.length === 0 ? (
          <p className="panel-empty">Chưa có cuốn nào được mượn.</p>
        ) : (
          <ul className="borrowed-list">
            {borrowed.map((book) => (
              <li key={book.id}>
                <div>
                  <p className="borrowed-title">{book.title}</p>
                  <p className="borrowed-author">{book.author}</p>
                </div>
                <span className={`tag tag-${CATEGORY_TONE[book.category]}`}>{book.category}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

/** Trang /stats — được lazy load trong App bằng React.lazy (cần default export). */
export default function StatsPage() {
  return (
    <div className="page">
      <header className="page-head">
        <h1>Thống kê</h1>
        <p>Tổng quan kho sách và tình trạng mượn của bạn.</p>
      </header>
      <BooksStatusGate>
        <StatsContent />
      </BooksStatusGate>
    </div>
  );
}
