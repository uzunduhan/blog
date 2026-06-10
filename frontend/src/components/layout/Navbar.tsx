import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

export function Navbar() {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query.trim() ? `/?q=${encodeURIComponent(query.trim())}` : '/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link to="/" className="text-blue-600 dark:text-blue-400 font-bold text-lg tracking-tight hover:text-blue-700 dark:hover:text-blue-300 transition-colors shrink-0">
          ◈ DevBlog
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Yazılarda ara..."
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors"
          />
        </form>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Tema değiştir"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>

          {isAuthenticated ? (
            <>
              <span className="text-gray-500 dark:text-gray-400 text-sm hidden sm:block">{user?.username}</span>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="secondary" className="text-xs py-1.5">Admin Panel</Button>
                </Link>
              )}
              <Link to="/my-posts">
                <Button variant="secondary" className="text-xs py-1.5">Yazılarım</Button>
              </Link>
              <Link to="/posts/create">
                <Button className="text-xs py-1.5">+ Yeni Yazı</Button>
              </Link>
              <Button variant="secondary" className="text-xs py-1.5" onClick={handleLogout}>
                Çıkış
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" className="text-xs py-1.5">Giriş</Button>
              </Link>
              <Link to="/register">
                <Button className="text-xs py-1.5">Kayıt Ol</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
