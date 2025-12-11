import type { PropsWithChildren } from "react";
import { cn } from "../../utils/classNames";

type BadgeVariant = "gray" | "success" | "primary" | "secondary" | "warning" | "danger" | "info";
type BadgeSize = "sm" | "md" | "lg";
type BadgeShape = "pill" | "square";

const variantStyles: Record<BadgeVariant, string> = {
  gray: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/20",
  success: "bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-600/20",
  primary: "bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-600/20",
  secondary: "bg-secondary-50 text-secondary-700 ring-1 ring-inset ring-secondary-600/20",
  warning: "bg-warm-50 text-warm-700 ring-1 ring-inset ring-warm-600/20",
  danger: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
  info: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

const shapeStyles: Record<BadgeShape, string> = {
  pill: "rounded-full",
  square: "rounded-md",
};

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  shape?: BadgeShape;
  icon?: React.ReactNode;
  dot?: boolean;
  className?: string;
}

export const Badge = ({
  children,
  variant = "gray",
  size = "sm",
  shape = "pill",
  icon,
  dot = false,
  className,
}: PropsWithChildren<BadgeProps>) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 font-semibold transition-all duration-200",
      variantStyles[variant],
      sizeStyles[size],
      shapeStyles[shape],
      className
    )}
  >
    {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
    {icon && <span className="flex-shrink-0">{icon}</span>}
    {children}
  </span>
);
