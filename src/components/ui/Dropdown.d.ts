import React from "react";
interface DropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: "left" | "right";
    className?: string;
}
export default function Dropdown({ trigger, children, align, className, }: DropdownProps): import("react/jsx-runtime").JSX.Element;
interface DropdownItemProps {
    children: React.ReactNode;
    onClick?: () => void;
    icon?: React.ReactNode;
    danger?: boolean;
    className?: string;
}
export declare function DropdownItem({ children, onClick, icon, danger, className, }: DropdownItemProps): import("react/jsx-runtime").JSX.Element;
export declare function DropdownDivider(): import("react/jsx-runtime").JSX.Element;
export {};
