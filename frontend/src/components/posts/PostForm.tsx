import { useState } from 'react';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import type { Category } from '../../types/category';

interface Props {
  initialValues?: { title: string; content: string; imageUrl?: string; categoryIds?: number[] };
  categories: Category[];
  onSubmit: (data: { title: string; content: string; imageUrl?: string; categoryIds: number[] }) => void;
  isLoading: boolean;
  error?: string;
}

const inputClass = 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors';
const labelClass = 'text-gray-700 dark:text-gray-300 text-sm font-medium';

export function PostForm({ initialValues, categories, onSubmit, isLoading, error }: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? '');
  const [selectedIds, setSelectedIds] = useState<number[]>(initialValues?.categoryIds ?? []);

  const toggleCategory = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, imageUrl: imageUrl.trim() || undefined, categoryIds: selectedIds });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <Alert message={error} />}

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Başlık</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Yazı başlığı..."
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Kapak Görseli URL <span className="text-gray-400 dark:text-gray-500 font-normal">(opsiyonel)</span></label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Kategoriler <span className="text-gray-400 dark:text-gray-500 font-normal">(opsiyonel)</span></label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                selectedIds.includes(cat.id)
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-400'
              }`}
            >
              {cat.name}
            </button>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500">Henüz kategori yok.</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>İçerik</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={12}
          placeholder="Yazı içeriği..."
          className={`${inputClass} resize-y`}
        />
      </div>

      <Button type="submit" isLoading={isLoading} className="self-end">
        Kaydet
      </Button>
    </form>
  );
}
