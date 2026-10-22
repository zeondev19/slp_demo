import { forwardRef } from 'react';

const variantStyles = {
  primary:
    'bg-primary text-white font-semibold hover:bg-primary-hover active:bg-primary-active',
  secondary:
    'bg-transparent border-1.5 border-primary text-primary font-semibold hover:bg-warm-bg active:bg-secondary/20',
  ghost:
    'bg-transparent text-text font-medium hover:bg-warm-bg active:bg-border',
  destructive:
    'bg-error text-white font-semibold hover:bg-red-700 active:bg-red-800',
};

const sizeStyles = {
  sm: 'h-[34px] min-h-[44px] px-4 text-sm',
  md: 'h-[42px] min-h-[44px] px-6 text-sm',
  lg: 'h-[50px] min-h-[44px] px-8 text-base',
};

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    disabled = false,
    children,
    onClick,
    className = '',
    type = 'button',
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center rounded
        transition-colors duration-150 cursor-pointer
        focus:ring-3 focus:ring-primary/20 focus:outline-none
        ${variantStyles[variant] || variantStyles.primary}
        ${sizeStyles[size] || sizeStyles.md}
        ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `.trim()}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
