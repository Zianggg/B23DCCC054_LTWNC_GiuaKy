import type { Book, BookDraft } from '../features/books/types';

const drafts: ReadonlyArray<BookDraft> = [
  { title: 'Clean Code', author: 'Robert C. Martin', category: 'CNTT', year: 2008, available: 3, total: 5 },
  { title: 'Lập trình TypeScript căn bản', author: 'Nguyễn Văn An', category: 'CNTT', year: 2021, available: 2, total: 4 },
  { title: 'Cấu trúc dữ liệu và giải thuật', author: 'Đỗ Xuân Lôi', category: 'CNTT', year: 2015, available: 0, total: 3 },
  { title: 'Design Patterns', author: 'Erich Gamma', category: 'CNTT', year: 1994, available: 1, total: 2 },
  { title: 'Học React qua ví dụ', author: 'Trần Minh Khoa', category: 'CNTT', year: 2023, available: 4, total: 4 },
  { title: 'Kinh tế học vi mô', author: 'N. Gregory Mankiw', category: 'Kinh tế', year: 2018, available: 2, total: 3 },
  { title: 'Nguyên lý kế toán', author: 'Phan Đức Dũng', category: 'Kinh tế', year: 2019, available: 0, total: 2 },
  { title: 'Marketing căn bản', author: 'Philip Kotler', category: 'Kinh tế', year: 2017, available: 3, total: 3 },
  { title: 'Tài chính doanh nghiệp', author: 'Nguyễn Minh Kiều', category: 'Kinh tế', year: 2020, available: 1, total: 2 },
  { title: 'English Grammar in Use', author: 'Raymond Murphy', category: 'Ngoại ngữ', year: 2019, available: 5, total: 6 },
  { title: 'Từ vựng IELTS theo chủ đề', author: 'Lê Thu Hà', category: 'Ngoại ngữ', year: 2022, available: 2, total: 3 },
  { title: 'Tiếng Nhật cho người mới bắt đầu', author: 'Minna no Nihongo', category: 'Ngoại ngữ', year: 2012, available: 0, total: 2 },
  { title: 'Hán ngữ quyển 1', author: 'Dương Ký Châu', category: 'Ngoại ngữ', year: 2014, available: 2, total: 2 },
];

/** Dữ liệu gốc của thư viện — chỉ đọc, API trả về bản sao. */
export const MOCK_BOOKS: ReadonlyArray<Readonly<Book>> = drafts.map((draft, index) => ({
  id: `b${index + 1}`,
  ...draft,
}));
