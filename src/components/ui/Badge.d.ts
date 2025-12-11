import type { PropsWithChildren } from "react";
type BadgeVariant = "gray" | "success" | "primary" | "secondary" | "warning" | "danger" | "info";
type BadgeSize = "sm" | "md" | "lg";
type BadgeShape = "pill" | "square";
interface BadgeProps {
    variant?: BadgeVariant;
    size?: BadgeSize;
    shape?: BadgeShape;
    icon?: React.ReactNode;
    dot?: boolean;
    className?: string;
}
export declare const Badge: ({ children, variant, size, shape, icon, dot, className, }: PropsWithChildren<BadgeProps>) => import("react/jsx-runtime").JSX.Element;
export {};
