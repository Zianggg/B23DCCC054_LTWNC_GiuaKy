import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { API_DELAY_MS } from './api/booksApi';
import { useFilterStore } from './features/filters/useFilterStore';
import { renderWithProviders } from './test/test-utils';

describe('<App /> (tích hợp)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useFilterStore.getState().resetFilters();
  });
  afterEach(() => jest.useRealTimers());

  const waitApi = () => act(() => jest.advanceTimersByTime(API_DELAY_MS));

  it('hiện "Đang tải..." rồi hiển thị danh sách sách', async () => {
    renderWithProviders(<App />);
    expect(screen.getByText('Đang tải...')).toBeInTheDocument();

    await waitApi();
    expect(screen.getByRole('heading', { name: 'Clean Code' })).toBeInTheDocument();
  });

  it('tìm kiếm có debounce 300ms', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderWithProviders(<App />);
    await waitApi();

    await user.type(screen.getByRole('searchbox', { name: 'Tìm kiếm sách' }), 'murphy');
    // Chưa đủ 300ms → danh sách chưa lọc
    expect(screen.getByRole('heading', { name: 'Clean Code' })).toBeInTheDocument();

    await act(() => jest.advanceTimersByTime(300));
    expect(screen.queryByRole('heading', { name: 'Clean Code' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'English Grammar in Use' })).toBeInTheDocument();
  });

  it('mượn quá 3 cuốn thì bị chặn và hiện cảnh báo', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { store } = renderWithProviders(<App />);
    await waitApi();

    const borrowButtons = screen.getAllByRole('button', { name: 'Mượn' }).filter((b) => !b.hasAttribute('disabled'));
    for (const button of borrowButtons.slice(0, 4)) {
      await user.click(button);
    }

    expect(store.getState().books.borrowedIds).toHaveLength(3);
    expect(screen.getByRole('alert')).toHaveTextContent('tối đa 3 cuốn');
  });

  it('lazy load trang /stats', async () => {
    renderWithProviders(<App />, { route: '/stats' });
    await waitApi();
    expect(await screen.findByRole('heading', { name: 'Thống kê' })).toBeInTheDocument();
    expect(screen.getByText('Số đầu sách theo thể loại')).toBeInTheDocument();
  });
});
