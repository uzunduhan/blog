import type { Comment } from '../../types/comment';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

interface Props {
  comments: Comment[];
  postId: number;
  onDelete: (commentId: number) => void;
}

export function CommentList({ comments, onDelete }: Props) {
  const { user, isAdmin } = useAuth();

  if (comments.length === 0) {
    return <p className="text-gray-500 text-sm">Henüz yorum yok. İlk yorumu sen yap!</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((c) => {
        const isOwner = user?.username === c.username;
        const date = new Date(c.createdDate).toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });

        return (
          <div key={c.id} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span className="text-gray-800 dark:text-gray-200 font-medium">{c.username}</span>
                <span>·</span>
                <span>{date}</span>
              </div>
              {(isAdmin || isOwner) && (
                <Button variant="danger" className="text-xs py-0.5 px-2 shrink-0" onClick={() => onDelete(c.id)}>
                  Sil
                </Button>
              )}
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{c.text}</p>
          </div>
        );
      })}
    </div>
  );
}
