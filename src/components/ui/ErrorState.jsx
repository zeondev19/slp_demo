import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
      role="alert"
    >
      <div className="mb-4 text-error" aria-hidden="true">
        <AlertCircle size={48} strokeWidth={1.5} />
      </div>

      <h3 className="text-lg font-semibold font-heading text-text mb-2">
        Error
      </h3>

      <p className="text-sm text-text-muted max-w-md mb-6">{message}</p>

      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
