const statusStyles = {
  success: 'bg-success/10 text-green-800 border border-success/30',
  warning: 'bg-warning/10 text-amber-800 border border-warning/30',
  error: 'bg-error/10 text-red-800 border border-error/30',
  info: 'bg-info/10 text-blue-800 border border-info/30',
};

export default function Chip({
  variant = 'filter',
  selected = false,
  onClick,
  children,
  className = '',
}) {
  if (variant === 'filter') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        className={`
          inline-flex items-center px-3 min-h-[44px] h-8 text-sm rounded-full
          cursor-pointer transition-colors duration-150
          focus:ring-3 focus:ring-primary/20 focus:outline-none
          ${
            selected
              ? 'bg-primary text-white font-medium'
              : 'bg-surface border border-border text-text-muted hover:border-border-hover'
          }
          ${className}
        `.trim()}
      >
        {children}
      </button>
    );
  }

  // Status chip – non-interactive
  const style = statusStyles[variant] || statusStyles.info;

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full
        ${style}
        ${className}
      `.trim()}
    >
      {children}
    </span>
  );
}
