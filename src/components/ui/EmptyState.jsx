export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      {icon && (
        <div className="mb-4 text-text-light" aria-hidden="true">
          {icon}
        </div>
      )}

      {title && (
        <h3 className="text-lg font-semibold font-heading text-text mb-2">
          {title}
        </h3>
      )}

      {description && (
        <p className="text-sm text-text-muted max-w-md mb-6">{description}</p>
      )}

      {action && <div>{action}</div>}
    </div>
  );
}
