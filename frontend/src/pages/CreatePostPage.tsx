import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/postsApi';
import { PostForm } from '../components/posts/PostForm';

export function CreatePostPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data: { title: string; content: string; imageUrl?: string }) => {
    setLoading(true);
    setError('');
    try {
      await createPost(data);
      navigate('/', { state: { info: 'Yazınız onay için gönderildi.' } });
    } catch {
      setError('Yazı oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Yeni Yazı</h1>
      <PostForm onSubmit={handleSubmit} isLoading={loading} error={error} />
    </div>
  );
}
