import type { InputHTMLAttributes } from "react";
import { cn } from "../../utils/classNames";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const SearchInput = ({ className, ...props }: SearchInputProps) => (
  <div className={cn("relative flex items-center", className)}>
    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m0-6.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
      </svg>
    </span>
    <input
      type="search"
      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
      {...props}
    />
  </div>
);
