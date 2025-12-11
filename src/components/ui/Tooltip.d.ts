import React from "react";
interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: "top" | "bottom" | "left" | "right";
    delay?: number;
    className?: string;
}
export default function Tooltip({ content, children, position, delay, className, }: TooltipProps): import("react/jsx-runtime").JSX.Element;
export {};
