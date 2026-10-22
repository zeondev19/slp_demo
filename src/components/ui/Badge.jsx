const variantStyles = {
  'primary-skill':
    'bg-tertiary/10 text-tertiary border border-tertiary/30 font-medium',
  'secondary-skill':
    'bg-tertiary/5 text-green-700 border border-tertiary/20',
  domain:
    'bg-secondary/20 text-amber-900 border border-secondary/40 font-medium',
  level:
    'bg-primary/10 text-primary border border-primary/20 font-medium',
};

export default function Badge({
  variant = 'primary-skill',
  children,
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 text-xs rounded
        ${variantStyles[variant] || variantStyles['primary-skill']}
        ${className}
      `.trim()}
    >
      {children}
    </span>
  );
}
