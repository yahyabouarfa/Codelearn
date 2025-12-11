import React from "react";

interface AvatarProps {
  name?: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "away";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const statusColors = {
  online: "bg-accent-500",
  offline: "bg-slate-400",
  away: "bg-warm-500",
};

export default function Avatar({ name, src, size = "md", status, className = "" }: AvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const gradients = [
    "from-primary-500 to-secondary-500",
    "from-secondary-500 to-primary-600",
    "from-accent-500 to-accent-600",
    "from-warm-500 to-warm-600",
  ];

  const gradientIndex = name
    ? name.charCodeAt(0) % gradients.length
    : 0;

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center font-semibold text-white bg-gradient-to-br ${gradients[gradientIndex]} ring-2 ring-white shadow-md transition-transform duration-200 hover:scale-105`}
      >
        {src ? (
          <img src={src} alt={name || "Avatar"} className="h-full w-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {status && (
        <span
          className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${statusColors[status]}`}
        />
      )}
    </div>
  );
}
