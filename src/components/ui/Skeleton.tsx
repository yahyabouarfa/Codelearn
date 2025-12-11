import React from "react";

interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string;
  height?: string;
  className?: string;
}

const variantClasses = {
  text: "rounded",
  circular: "rounded-full",
  rectangular: "rounded-none",
  rounded: "rounded-xl",
};

export default function Skeleton({
  variant = "rounded",
  width,
  height,
  className = "",
}: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`shimmer-effect animate-shimmer ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Compound components for common patterns
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="space-y-4">
        <Skeleton height="24px" width="60%" />
        <Skeleton height="16px" width="100%" />
        <Skeleton height="16px" width="80%" />
        <div className="flex gap-2 pt-2">
          <Skeleton height="32px" width="80px" variant="rounded" />
          <Skeleton height="32px" width="80px" variant="rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="16px"
          width={i === lines - 1 ? "70%" : "100%"}
          variant="text"
        />
      ))}
    </div>
  );
}
