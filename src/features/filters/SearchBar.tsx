import { useEffect, useState } from 'react';
import { Icon } from '../../components/Icon';
import { useDebounce } from '../../hooks/useDebounce';
import { useFilterStore } from './useFilterStore';

export const SEARCH_DEBOUNCE_MS = 300;

export function SearchBar() {
  const keyword = useFilterStore((s) => s.keyword);
  const setKeyword = useFilterStore((s) => s.setKeyword);
  const [input, setInput] = useState(keyword);
  const debouncedInput = useDebounce(input, SEARCH_DEBOUNCE_MS);

  // Chỉ đẩy từ khoá vào store sau khi người dùng ngừng gõ 300ms
  useEffect(() => {
    setKeyword(debouncedInput);
  }, [debouncedInput, setKeyword]);

  return (
    <label className="search">
      <Icon name="search" />
      <input
        type="search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Tìm theo tên sách hoặc tác giả…"
        aria-label="Tìm kiếm sách"
      />
    </label>
  );
}
