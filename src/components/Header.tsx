import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectBorrowedIds } from '../features/books/booksSlice';
import { ThemeToggle } from '../features/theme/ThemeToggle';
import { Icon } from './Icon';

const navClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'nav-link is-active' : 'nav-link');

export function Header() {
  const borrowedCount = useAppSelector((state) => selectBorrowedIds(state).length);

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <NavLink to="/" className="brand">
          <span className="brand-mark"><Icon name="book" /></span>
          Mini Library
        </NavLink>

        <nav className="nav">
          <NavLink to="/" end className={navClass}>
            Thư viện
            {borrowedCount > 0 && <span className="nav-badge">{borrowedCount}</span>}
          </NavLink>
          <NavLink to="/stats" className={navClass}>Thống kê</NavLink>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
