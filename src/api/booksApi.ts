import type { Book } from '../features/books/types';
import type { ApiResponse } from '../types/api';
import { MOCK_BOOKS } from './mockBooks';

export const API_DELAY_MS = 500;

export interface FetchBooksOptions {
  /** true để giả lập API thất bại */
  shouldFail?: boolean;
  delay?: number;
}

/** API giả lập: trả về danh sách sách sau ~500ms, hoặc lỗi khi `shouldFail = true`. */
export function fetchBooksApi({
  shouldFail = false,
  delay = API_DELAY_MS,
}: FetchBooksOptions = {}): Promise<ApiResponse<Book[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({ ok: false, error: 'Không thể tải danh sách sách. Vui lòng thử lại.' });
        return;
      }
      resolve({ ok: true, data: MOCK_BOOKS.map((book) => ({ ...book })) });
    }, delay);
  });
}
