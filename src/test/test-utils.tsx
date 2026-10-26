import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { setupStore, type AppStore, type RootState } from '../app/store';
import { initialState } from '../features/books/booksSlice';
import type { Book, BooksState } from '../features/books/types';
import { ThemeProvider } from '../features/theme/ThemeProvider';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
  route?: string;
}

/** Render kèm Redux + Theme + Router; mỗi lần gọi tạo store mới để các test độc lập. */
export function renderWithProviders(
  ui: ReactElement,
  { preloadedState, store = setupStore(preloadedState), route = '/', ...options }: ExtendedRenderOptions = {},
) {
  return {
    store,
    ...render(ui, {
      wrapper: ({ children }) => (
        <Provider store={store}>
          <ThemeProvider>
            <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
          </ThemeProvider>
        </Provider>
      ),
      ...options,
    }),
  };
}

export const makeBook = (override: Partial<Book> = {}): Book => ({
  id: 'b1',
  title: 'Clean Code',
  author: 'Robert C. Martin',
  category: 'CNTT',
  year: 2008,
  available: 3,
  total: 5,
  ...override,
});

export const makeBooksState = (override: Partial<BooksState> = {}): BooksState => ({
  ...initialState,
  status: 'succeeded',
  ...override,
});
