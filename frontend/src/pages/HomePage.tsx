import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Post } from '../types/post';
import { getApproved } from '../api/postsApi';
import { PostCard } from '../components/posts/PostCard';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  useEffect(() => {
    getApproved()
      .then(setPosts)
      .catch(() => setError('Yazılar yüklenemedi.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = query
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.content.toLowerCase().includes(query.toLowerCase())
      )
    : posts;

  const popular = [...posts].sort((a, b) => b.commentCount - a.commentCount).slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {query && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          "<span className="font-medium text-gray-800 dark:text-gray-200">{query}</span>" için {filtered.length} sonuç
        </p>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{query ? 'Arama Sonuçları' : 'Son Yazılar'}</h1>

          {loading && <Spinner />}
          {error && <Alert message={error} />}

          {!loading && !error && filtered.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">
              {query ? 'Sonuç bulunamadı.' : 'Henüz onaylanmış yazı yok.'}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </main>

        <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-colors">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">Popüler Yazılar</h2>
            {loading ? (
              <Spinner />
            ) : popular.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 text-sm">Henüz yazı yok.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {popular.map((post) => (
                  <Link key={post.id} to={`/posts/${post.id}`} className="flex gap-3 group">
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center">
                          <span className="text-lg font-bold text-blue-300 dark:text-blue-500">{post.authorUsername[0]?.toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {post.commentCount > 0 ? `${post.commentCount} yorum` : post.authorUsername}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-5 transition-colors">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">Bu Blog Hakkında</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Teknoloji, yazılım ve daha fazlası hakkında yazarların deneyimlerini paylaştığı bir platform.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
