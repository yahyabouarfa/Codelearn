import React from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "linear" | "circular";
  showLabel?: boolean;
  color?: "primary" | "secondary" | "accent" | "warm";
  className?: string;
}

const colorClasses = {
  primary: "text-primary-600",
  secondary: "text-secondary-600",
  accent: "text-accent-600",
  warm: "text-warm-600",
};

const gradientClasses = {
  primary: "from-primary-500 to-primary-600",
  secondary: "from-secondary-500 to-secondary-600",
  accent: "from-accent-500 to-accent-600",
  warm: "from-warm-500 to-warm-600",
};

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export default function ProgressBar({
  value,
  max = 100,
  size = "md",
  variant = "linear",
  showLabel = false,
  color = "primary",
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  if (variant === "circular") {
    return <CircularProgress percentage={percentage} color={color} showLabel={showLabel} />;
  }

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full bg-gradient-to-r ${gradientClasses[color]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-sm font-medium mt-1 block ${colorClasses[color]}`}>
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

interface CircularProgressProps {
  percentage: number;
  color: "primary" | "secondary" | "accent" | "warm";
  showLabel: boolean;
  size?: number;
}

function CircularProgress({ percentage, color, showLabel, size = 48 }: CircularProgressProps) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    primary: "#4f46e5",
    secondary: "#9333ea",
    accent: "#10b981",
    warm: "#f97316",
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorMap[color]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showLabel && (
        <span
          className={`absolute text-xs font-semibold ${colorClasses[color]}`}
          style={{ fontSize: size / 4 }}
        >
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
