import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    helperText,
    error = false,
    errorMessage,
    className = '',
    id: idProp,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const inputId = idProp || autoId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const hasError = error || !!errorMessage;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text"
        >
          {label}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        aria-invalid={hasError || undefined}
        aria-describedby={
          hasError ? errorId : helperText ? helperId : undefined
        }
        className={`
          h-[42px] px-3 rounded text-sm font-body text-text
          border-[1.5px] bg-surface
          transition-colors duration-150
          placeholder:text-text-light
          focus:outline-none focus:ring-3 focus:ring-primary/20
          ${
            hasError
              ? 'border-error focus:border-error'
              : 'border-border-hover focus:border-primary'
          }
        `.trim()}
        {...rest}
      />

      {hasError && errorMessage && (
        <p id={errorId} className="text-xs text-error" role="alert">
          {errorMessage}
        </p>
      )}

      {!hasError && helperText && (
        <p id={helperId} className="text-xs text-text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
