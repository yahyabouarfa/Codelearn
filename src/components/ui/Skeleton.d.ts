interface SkeletonProps {
    variant?: "text" | "circular" | "rectangular" | "rounded";
    width?: string;
    height?: string;
    className?: string;
}
export default function Skeleton({ variant, width, height, className, }: SkeletonProps): import("react/jsx-runtime").JSX.Element;
export declare function SkeletonCard(): import("react/jsx-runtime").JSX.Element;
export declare function SkeletonText({ lines }: {
    lines?: number;
}): import("react/jsx-runtime").JSX.Element;
export {};
