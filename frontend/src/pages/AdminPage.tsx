import { useEffect, useState } from 'react';
import type { Post } from '../types/post';
import type { Category } from '../types/category';
import { getPending, approvePost, deletePost } from '../api/postsApi';
import { getAll, createCategory, deleteCategory } from '../api/categoriesApi';
import { PostCard } from '../components/posts/PostCard';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';

export function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState('');

  useEffect(() => {
    getPending()
      .then(setPosts)
      .catch(() => setError('Yazılar yüklenemedi.'))
      .finally(() => setLoading(false));

    getAll().then(setCategories).catch(() => {});
  }, []);

  const handleApprove = async (id: number) => {
    await approvePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yazıyı silmek istediğinizden emin misiniz?')) return;
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddCategory = async () => {
    const name = newCatName.trim();
    if (!name) return;
    setCatLoading(true);
    setCatError('');
    try {
      const cat = await createCategory(name);
      setCategories((prev) => [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCatName('');
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setCatError(status === 409 ? 'Bu kategori zaten mevcut.' : 'Kategori eklenemedi.');
    } finally {
      setCatLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Kategoriyi silmek istediğinizden emin misiniz?')) return;
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Admin Paneli</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Onay bekleyen yazılar ve kategori yönetimi</p>

      {loading && <Spinner />}
      {error && <Alert message={error} />}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">Onay bekleyen yazı yok.</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            showStatus
            onApprove={handleApprove}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Kategori Yönetimi</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Yeni kategori ekleyin veya mevcut kategorileri silin.</p>

        {catError && <Alert message={catError} />}

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            placeholder="Yeni kategori adı..."
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <Button onClick={handleAddCategory} isLoading={catLoading} disabled={!newCatName.trim()}>
            Ekle
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1.5"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">{cat.name}</span>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors font-bold leading-none"
                aria-label={`${cat.name} kategorisini sil`}
              >
                ×
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500">Henüz kategori yok.</p>
          )}
        </div>
      </div>
    </div>
  );
}
