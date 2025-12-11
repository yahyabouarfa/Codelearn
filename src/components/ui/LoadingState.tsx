import type { PropsWithChildren } from "react";
import { cn } from "../../utils/classNames";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState = ({
  message = "Loading data…",
  className,
  children
}: PropsWithChildren<LoadingStateProps>) => (
  <div className={cn("flex w-full flex-col items-center justify-center gap-3 py-10", className)}>
    <span className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
    <p className="text-sm text-gray-600">{message}</p>
    {children}
  </div>
);
