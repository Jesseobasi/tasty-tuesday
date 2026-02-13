import clsx from 'clsx';

export const Spinner = ({ label, className }: { label?: string; className?: string }) => (
  <div className={clsx('flex items-center gap-2 text-sm text-muted', className)}>
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
    {label && <span>{label}</span>}
  </div>
);
