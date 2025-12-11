interface ProgressBarProps {
    value: number;
    max?: number;
    size?: "sm" | "md" | "lg";
    variant?: "linear" | "circular";
    showLabel?: boolean;
    color?: "primary" | "secondary" | "accent" | "warm";
    className?: string;
}
export default function ProgressBar({ value, max, size, variant, showLabel, color, className, }: ProgressBarProps): import("react/jsx-runtime").JSX.Element;
export {};
