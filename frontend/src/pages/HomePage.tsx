import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { PagedResult, Post } from '../types/post';
import type { Category } from '../types/category';
import { getApproved } from '../api/postsApi';
import { getAll as getCategories } from '../api/categoriesApi';
import { PostCard } from '../components/posts/PostCard';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Pagination } from '../components/ui/Pagination';

export function HomePage() {
  const [result, setResult] = useState<PagedResult<Post> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
  }, [selectedCategoryId, query]);

  useEffect(() => {
    setLoading(true);
    setError('');
    getApproved({
      categoryId: selectedCategoryId ?? undefined,
      search: query || undefined,
      page,
      pageSize: 6,
    })
      .then(setResult)
      .catch(() => setError('Yazılar yüklenemedi.'))
      .finally(() => setLoading(false));
  }, [selectedCategoryId, query, page]);

  const posts = result?.items ?? [];
  const popular = [...posts].sort((a, b) => b.commentCount - a.commentCount).slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {query && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          "<span className="font-medium text-gray-800 dark:text-gray-200">{query}</span>" için {result?.totalCount ?? 0} sonuç
        </p>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {query ? 'Arama Sonuçları' : 'Son Yazılar'}
          </h1>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => { setSelectedCategoryId(null); setPage(1); }}
                className={`text-sm px-4 py-1.5 rounded-full border font-medium transition-colors ${
                  selectedCategoryId === null
                    ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-500 dark:hover:border-gray-400'
                }`}
              >
                Tümü
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategoryId(cat.id === selectedCategoryId ? null : cat.id); setPage(1); }}
                  className={`text-sm px-4 py-1.5 rounded-full border font-medium transition-colors ${
                    selectedCategoryId === cat.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-400'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {loading && <Spinner />}
          {error && <Alert message={error} />}

          {!loading && !error && posts.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">
              {query ? 'Sonuç bulunamadı.' : 'Henüz onaylanmış yazı yok.'}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={result?.totalPages ?? 1}
            onPageChange={setPage}
          />
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
