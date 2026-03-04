import type { ButtonHTMLAttributes } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
}

export default function PrimaryButton({
  children,
  variant = 'solid',
  size = 'md',
  isLoading = false,
  loadingText,
  className = '',
  disabled,
  ...props
}: PrimaryButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    solid: 'bg-secondary-500 hover:bg-secondary-400 text-white border border-transparent hover:shadow-[0_0_30px_rgba(249,115,22,0.6),0_0_60px_rgba(249,115,22,0.3)]',
    outline: 'bg-transparent border border-secondary-500 text-secondary-400 hover:bg-secondary-500/10',
  };

  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-lg transition-all duration-200
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-400
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
