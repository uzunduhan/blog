import { useEffect, useState } from 'react';
import type { Post } from '../types/post';
import { getUserPosts, deletePost } from '../api/postsApi';
import { PostCard } from '../components/posts/PostCard';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';

export function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getUserPosts()
      .then(setPosts)
      .catch(() => setError('Yazılar yüklenemedi.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Yazılarım</h1>

      {loading && <Spinner />}
      {error && <Alert message={error} />}

      {!loading && !error && posts.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">Henüz hiç yazı yazmadınız.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} showStatus onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
