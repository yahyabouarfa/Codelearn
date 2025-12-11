import type { PropsWithChildren } from "react";
import { cn } from "../../utils/classNames";

interface CardProps {
  className?: string;
  variant?: "elevated" | "flat" | "bordered" | "gradient";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

const variantStyles = {
  elevated: "bg-white shadow-lg border border-slate-100",
  flat: "bg-white border border-slate-200",
  bordered: "bg-white border-2 border-slate-300",
  gradient: "bg-gradient-to-br from-white to-slate-50 border border-slate-100 shadow-md",
};

const paddingStyles = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = ({
  children,
  className,
  variant = "elevated",
  hover = false,
  padding = "md",
  onClick,
}: PropsWithChildren<CardProps>) => (
  <div
    className={cn(
      "rounded-2xl transition-all duration-300",
      variantStyles[variant],
      paddingStyles[padding],
      hover && "hover:-translate-y-2 hover:shadow-xl cursor-pointer",
      onClick && "cursor-pointer",
      className
    )}
    onClick={onClick}
  >
    {children}
  </div>
);
