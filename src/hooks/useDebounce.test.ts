import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('chỉ cập nhật giá trị sau khi hết thời gian delay, và reset khi giá trị đổi liên tục', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'r' },
    });
    expect(result.current).toBe('r');

    rerender({ value: 're' });
    act(() => jest.advanceTimersByTime(200));
    rerender({ value: 'react' });
    act(() => jest.advanceTimersByTime(200));
    // Mới qua 200ms kể từ lần đổi cuối → vẫn là giá trị cũ
    expect(result.current).toBe('r');

    act(() => jest.advanceTimersByTime(100));
    expect(result.current).toBe('react');
  });
});
