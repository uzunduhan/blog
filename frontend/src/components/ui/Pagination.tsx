interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function buildPageRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  const pages: (number | '...')[] = [1];
  if (left > 2) pages.push('...');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push('...');
  pages.push(total);
  return pages;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageRange(page, totalPages);

  const btnBase =
    'text-sm px-4 py-1.5 rounded-full border font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const btnInactive =
    'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-500 dark:hover:border-gray-400';
  const btnActive =
    'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100';

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        className={`${btnBase} ${btnInactive}`}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        ‹
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400 dark:text-gray-500 text-sm select-none">
            ...
          </span>
        ) : (
          <button
            key={p}
            className={`${btnBase} ${p === page ? btnActive : btnInactive}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        className={`${btnBase} ${btnInactive}`}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        ›
      </button>
    </div>
  );
}
