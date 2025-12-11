import React, { useState, useRef, useEffect } from "react";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

export default function Dropdown({
  trigger,
  children,
  align = "right",
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const alignmentClasses = align === "left" ? "left-0" : "right-0";

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={`absolute ${alignmentClasses} mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-slide-down`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
  className?: string;
}

export function DropdownItem({
  children,
  onClick,
  icon,
  danger = false,
  className = "",
}: DropdownItemProps) {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors duration-150 ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-700 hover:bg-slate-50"
      } ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

export function DropdownDivider() {
  return <div className="my-1 border-t border-slate-200" />;
}
