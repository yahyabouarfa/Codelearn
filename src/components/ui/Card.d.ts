import type { PropsWithChildren } from "react";
interface CardProps {
    className?: string;
    variant?: "elevated" | "flat" | "bordered" | "gradient";
    hover?: boolean;
    padding?: "none" | "sm" | "md" | "lg";
    onClick?: () => void;
}
export declare const Card: ({ children, className, variant, hover, padding, onClick, }: PropsWithChildren<CardProps>) => import("react/jsx-runtime").JSX.Element;
export {};
