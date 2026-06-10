interface Props {
  children: string;
  variant?: 'default' | 'pending' | 'approved' | 'admin';
}

const variants = {
  default: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  pending: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400',
  approved: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
  admin: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
};

export function Badge({ children, variant = 'default' }: Props) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
