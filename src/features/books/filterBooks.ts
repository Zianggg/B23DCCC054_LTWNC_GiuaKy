import type { Book, CategoryFilter } from './types';

const normalize = (text: string) => text.trim().toLocaleLowerCase('vi');

/** Lọc sách theo từ khoá (tên hoặc tác giả, không phân biệt hoa thường) và thể loại. */
export function filterBooks(
  books: readonly Book[],
  keyword: string,
  category: CategoryFilter,
): Book[] {
  const query = normalize(keyword);
  return books.filter((book) => {
    if (category !== 'ALL' && book.category !== category) return false;
    if (!query) return true;
    return normalize(book.title).includes(query) || normalize(book.author).includes(query);
  });
}
