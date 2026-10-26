import { BookList } from '../features/books/components/BookList';
import { BooksStatusGate } from '../features/books/components/BooksStatusGate';
import { BorrowedPanel } from '../features/books/components/BorrowedPanel';
import { WarningBanner } from '../features/books/components/WarningBanner';
import { CategoryFilterBar } from '../features/filters/CategoryFilterBar';
import { SearchBar } from '../features/filters/SearchBar';

export function LibraryPage() {
  return (
    <div className="page">
      <header className="page-head">
        <h1>Tra cứu sách</h1>
        <p>Tìm sách theo tên hoặc tác giả, mượn tối đa 3 cuốn cùng lúc.</p>
      </header>

      <div className="toolbar">
        <SearchBar />
        <CategoryFilterBar />
      </div>

      <WarningBanner />

      <BooksStatusGate>
        <div className="library-layout">
          <section className="library-main">
            <BookList />
          </section>
          <BorrowedPanel />
        </div>
      </BooksStatusGate>
    </div>
  );
}
