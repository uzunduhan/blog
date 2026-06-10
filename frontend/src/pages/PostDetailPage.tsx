import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Post } from '../types/post';
import type { Comment } from '../types/comment';
import { getById, deletePost } from '../api/postsApi';
import { getByPost, createComment, deleteComment } from '../api/commentsApi';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { CommentList } from '../components/comments/CommentList';
import { CommentForm } from '../components/comments/CommentForm';
import { useAuth } from '../hooks/useAuth';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const postId = Number(id);

  useEffect(() => {
    Promise.all([getById(postId), getByPost(postId)])
      .then(([p, c]) => {
        setPost(p);
        setComments(c);
      })
      .catch(() => setError('Yazı yüklenemedi.'))
      .finally(() => setLoading(false));
  }, [postId]);

  const handleDelete = async () => {
    if (!confirm('Yazıyı silmek istediğinizden emin misiniz?')) return;
    await deletePost(postId);
    navigate('/');
  };

  const handleAddComment = async (text: string) => {
    setCommentLoading(true);
    try {
      const c = await createComment(postId, { text });
      setComments((prev) => [...prev, c]);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    await deleteComment(postId, commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-8"><Spinner /></div>;
  if (error || !post) return <div className="max-w-3xl mx-auto px-4 py-8"><Alert message={error || 'Yazı bulunamadı.'} /></div>;

  const isOwner = user?.username === post.authorUsername;
  const date = new Date(post.createdDate).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const initial = post.authorUsername[0]?.toUpperCase() ?? '?';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover rounded-xl mb-6" />
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">{post.title}</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-sm font-bold flex items-center justify-center">
              {initial}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">{post.authorUsername}</span>
              <span>·</span>
              <span>{date}</span>
            </div>
          </div>
          {(isAdmin || isOwner) && (
            <div className="flex gap-2">
              <Link to={`/posts/${post.id}/edit`}>
                <Button variant="secondary" className="text-xs py-1">Düzenle</Button>
              </Link>
              <Button variant="danger" className="text-xs py-1" onClick={handleDelete}>Sil</Button>
            </div>
          )}
        </div>
      </div>

      <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-10 border-b border-gray-200 dark:border-gray-700 pb-8">
        {post.content}
      </div>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Yorumlar ({comments.length})</h2>
        <CommentList comments={comments} postId={postId} onDelete={handleDeleteComment} />

        {isAuthenticated && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Yorum Ekle</h3>
            <CommentForm onSubmit={handleAddComment} isLoading={commentLoading} />
          </div>
        )}
        {!isAuthenticated && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Yorum yapmak için <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">giriş yapın</Link>.
          </p>
        )}
      </section>
    </div>
  );
}
