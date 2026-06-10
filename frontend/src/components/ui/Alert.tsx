interface Props {
  message: string;
  type?: 'error' | 'success' | 'info';
}

const styles = {
  error: 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400',
  success: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400',
  info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400',
};

export function Alert({ message, type = 'error' }: Props) {
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  );
}
