import { Link, useNavigate } from 'react-router-dom';
import type { Post } from '../../types/post';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  post: Post;
  showStatus?: boolean;
  onApprove?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function PostCard({ post, showStatus, onApprove, onDelete }: Props) {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const isOwner = user?.username === post.authorUsername;
  const excerpt = post.content.length > 120 ? post.content.slice(0, 120) + '...' : post.content;
  const date = new Date(post.createdDate).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const initial = post.authorUsername[0]?.toUpperCase() ?? '?';

  return (
    <div
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md dark:hover:shadow-none dark:hover:border-gray-600 transition-all cursor-pointer flex flex-col"
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      {post.imageUrl ? (
        <img src={post.imageUrl} alt={post.title} className="w-full h-44 object-cover" />
      ) : (
        <div className="w-full h-44 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center">
          <span className="text-5xl font-bold text-blue-300 dark:text-blue-500 select-none">{initial}</span>
        </div>
      )}

      <div className="p-5 flex flex-col gap-3 flex-1">
        {showStatus && (
          <div onClick={(e) => e.stopPropagation()}>
            <Badge variant={post.isApproved ? 'approved' : 'pending'}>
              {post.isApproved ? 'Onaylı' : 'Bekliyor'}
            </Badge>
          </div>
        )}

        <Link
          to={`/posts/${post.id}`}
          className="text-gray-900 dark:text-gray-100 font-semibold text-base leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {post.title}
        </Link>

        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
            {post.categories.map((cat) => (
              <Badge key={cat.id} variant="default">{cat.name}</Badge>
            ))}
          </div>
        )}

        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-1">{excerpt}</p>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">
              {initial}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">{post.authorUsername}</span>
              <span>·</span>
              <span>{date}</span>
              {post.commentCount > 0 && (
                <>
                  <span>·</span>
                  <span>{post.commentCount} yorum</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {onApprove && !post.isApproved && (
              <Button variant="secondary" className="text-xs py-1 px-2" onClick={() => onApprove(post.id)}>
                Onayla
              </Button>
            )}
            {(isAdmin || isOwner) && onDelete && (
              <Button variant="danger" className="text-xs py-1 px-2" onClick={() => onDelete(post.id)}>
                Sil
              </Button>
            )}
            <Link
              to={`/posts/${post.id}`}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Oku →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
