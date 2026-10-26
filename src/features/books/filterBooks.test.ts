import { makeBook } from '../../test/test-utils';
import { filterBooks } from './filterBooks';

const books = [
  makeBook({ id: 'b1', title: 'Clean Code', author: 'Robert C. Martin', category: 'CNTT' }),
  makeBook({ id: 'b2', title: 'Marketing căn bản', author: 'Philip Kotler', category: 'Kinh tế' }),
  makeBook({ id: 'b3', title: 'English Grammar in Use', author: 'Raymond Murphy', category: 'Ngoại ngữ' }),
];

describe('filterBooks', () => {
  it('trả về tất cả khi không có từ khoá và chọn "Tất cả"', () => {
    expect(filterBooks(books, '', 'ALL')).toHaveLength(3);
  });

  it('tìm theo tên không phân biệt hoa thường', () => {
    expect(filterBooks(books, 'CLEAN', 'ALL').map((b) => b.id)).toEqual(['b1']);
  });

  it('tìm theo tác giả', () => {
    expect(filterBooks(books, '  kotler ', 'ALL').map((b) => b.id)).toEqual(['b2']);
  });

  it('kết hợp từ khoá với thể loại', () => {
    expect(filterBooks(books, 'r', 'Ngoại ngữ').map((b) => b.id)).toEqual(['b3']);
    expect(filterBooks(books, 'clean', 'Kinh tế')).toEqual([]);
  });
});
