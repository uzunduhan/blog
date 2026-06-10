import { useState } from 'react';
import { Button } from '../ui/Button';

interface Props {
  onSubmit: (text: string) => Promise<void>;
  isLoading: boolean;
}

export function CommentForm({ onSubmit, isLoading }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await onSubmit(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Yorumunuzu yazın..."
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors resize-none"
      />
      <Button type="submit" isLoading={isLoading} className="self-end text-sm py-1.5">
        Yorum Yap
      </Button>
    </form>
  );
}
