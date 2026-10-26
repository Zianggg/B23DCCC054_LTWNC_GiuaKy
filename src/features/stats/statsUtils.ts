import type { Book, CategoryStats } from '../books/types';

/** Đếm số đầu sách theo từng thể loại. */
export function countByCategory(books: readonly Book[]): CategoryStats {
  const initial: CategoryStats = { CNTT: 0, 'Kinh tế': 0, 'Ngoại ngữ': 0 };
  return books.reduce<CategoryStats>(
    (acc, book) => ({ ...acc, [book.category]: acc[book.category] + 1 }),
    initial,
  );
}
