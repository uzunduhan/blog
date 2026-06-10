import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { register } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

const inputClass = 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors';

export function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({ username, email, password });
      navigate('/login', { state: { success: 'Kayıt başarılı! Giriş yapabilirsiniz.' } });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message ?? 'Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm dark:shadow-none transition-colors">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Kayıt Ol</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <Alert message={error} />}

          <div className="flex flex-col gap-1.5">
            <label className="text-gray-700 dark:text-gray-300 text-sm font-medium">Kullanıcı Adı</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-gray-700 dark:text-gray-300 text-sm font-medium">E-posta</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-gray-700 dark:text-gray-300 text-sm font-medium">Şifre</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className={inputClass} />
          </div>

          <Button type="submit" isLoading={loading} className="mt-1">
            Kayıt Ol
          </Button>
        </form>

        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
          Zaten hesabın var mı?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Giriş yap</Link>
        </p>
      </div>
    </div>
  );
}
