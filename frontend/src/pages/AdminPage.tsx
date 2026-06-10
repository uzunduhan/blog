import { useEffect, useState } from 'react';
import type { Post } from '../types/post';
import { getPending, approvePost, deletePost } from '../api/postsApi';
import { PostCard } from '../components/posts/PostCard';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';

export function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPending()
      .then(setPosts)
      .catch(() => setError('Yazılar yüklenemedi.'))
      .finally(() => setLoading(false));
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Admin Paneli</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Onay bekleyen yazılar</p>

      {loading && <Spinner />}
      {error && <Alert message={error} />}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-16">
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
    </div>
  );
}
