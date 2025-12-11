import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
type ButtonVariant = "primary" | "secondary" | "ghost" | "success" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "xl";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    fullWidth?: boolean;
}
export declare const Button: ({ children, className, variant, size, loading, disabled, icon, iconPosition, fullWidth, ...props }: PropsWithChildren<ButtonProps>) => import("react/jsx-runtime").JSX.Element;
export {};
