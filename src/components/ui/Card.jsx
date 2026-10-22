const variantStyles = {
  default:
    'bg-surface border border-border rounded-lg hover:border-border-hover transition-colors duration-150',
  elevated:
    'bg-bg border-2 border-border-hover rounded-lg hover:border-border-strong transition-colors duration-150',
};

export default function Card({
  variant = 'default',
  children,
  className = '',
  onClick,
}) {
  const isClickable = typeof onClick === 'function';

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      className={`
        ${variantStyles[variant] || variantStyles.default}
        ${isClickable ? 'cursor-pointer focus:ring-3 focus:ring-primary/20 focus:outline-none' : ''}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}
