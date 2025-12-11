import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../utils/classNames";

type ButtonVariant = "primary" | "secondary" | "ghost" | "success" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2.5",
  xl: "px-8 py-4 text-lg rounded-2xl gap-3",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus-visible:outline-primary-600 shadow-md hover:shadow-lg",
  secondary:
    "bg-gradient-to-r from-secondary-600 to-secondary-700 text-white hover:from-secondary-700 hover:to-secondary-800 focus-visible:outline-secondary-600 shadow-md hover:shadow-lg",
  ghost:
    "text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-slate-300",
  success:
    "bg-gradient-to-r from-accent-600 to-accent-700 text-white hover:from-accent-700 hover:to-accent-800 focus-visible:outline-accent-600 shadow-md hover:shadow-lg",
  danger:
    "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus-visible:outline-red-600 shadow-md hover:shadow-lg",
  outline:
    "bg-white text-slate-700 border-2 border-slate-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-primary-600 shadow-sm",
};

export const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  icon,
  iconPosition = "left",
  fullWidth = false,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  const showIcon = icon && !loading;
  const showSpinner = loading;

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {showSpinner && (
        <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
      )}
      {showIcon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {showIcon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
};
