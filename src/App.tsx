import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppDispatch } from './app/hooks';
import { Header } from './components/Header';
import { fetchBooks } from './features/books/booksSlice';
import { LibraryPage } from './pages/LibraryPage';

// Trang Thống kê tách thành chunk riêng, chỉ tải khi vào /stats
const StatsPage = lazy(() => import('./features/stats/StatsPage'));

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Thêm ?fail vào URL để giả lập API lỗi
    const shouldFail = new URLSearchParams(window.location.search).has('fail');
    dispatch(fetchBooks({ shouldFail }));
  }, [dispatch]);

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <Suspense fallback={<div className="state" role="status">Đang tải trang...</div>}>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="*" element={<p className="empty">Không tìm thấy trang.</p>} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
