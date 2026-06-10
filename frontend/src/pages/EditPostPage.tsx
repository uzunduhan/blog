import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getById, updatePost } from '../api/postsApi';
import { PostForm } from '../components/posts/PostForm';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';

export function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = Number(id);

  const [initialValues, setInitialValues] = useState<{ title: string; content: string; imageUrl?: string } | null>(null);
  const [loadError, setLoadError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    getById(postId)
      .then((p) => setInitialValues({ title: p.title, content: p.content, imageUrl: p.imageUrl }))
      .catch(() => setLoadError('Yazı yüklenemedi.'));
  }, [postId]);

  const handleSubmit = async (data: { title: string; content: string; imageUrl?: string }) => {
    setSubmitLoading(true);
    setSubmitError('');
    try {
      await updatePost(postId, data);
      navigate(`/posts/${postId}`);
    } catch {
      setSubmitError('Yazı güncellenirken bir hata oluştu.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loadError) return <div className="max-w-3xl mx-auto px-4 py-8"><Alert message={loadError} /></div>;
  if (!initialValues) return <div className="max-w-3xl mx-auto px-4 py-8"><Spinner /></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Yazıyı Düzenle</h1>
      <PostForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isLoading={submitLoading}
        error={submitError}
      />
    </div>
  );
}
