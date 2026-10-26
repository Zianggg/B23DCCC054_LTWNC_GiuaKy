export const CATEGORIES = ['CNTT', 'Kinh tế', 'Ngoại ngữ'] as const;

export type Category = (typeof CATEGORIES)[number];

/** Giá trị bộ lọc thể loại: 'ALL' = Tất cả. */
export type CategoryFilter = Category | 'ALL';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  year: number;
  /** Số bản còn lại có thể mượn */
  available: number;
  /** Tổng số bản thư viện có */
  total: number;
}

/** Thông tin rút gọn của cuốn đang mượn (Utility Type: Pick). */
export type BorrowedBook = Pick<Book, 'id' | 'title' | 'author' | 'category'>;

/** Dữ liệu sách khi chưa có id (Utility Type: Omit). */
export type BookDraft = Omit<Book, 'id'>;

/** Số đầu sách theo thể loại (Utility Type: Record). */
export type CategoryStats = Record<Category, number>;

export type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface BooksState {
  items: Book[];
  borrowedIds: string[];
  status: LoadStatus;
  error: string | null;
  /** Cảnh báo khi vượt giới hạn mượn (do middleware đặt) */
  warning: string | null;
}

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}
