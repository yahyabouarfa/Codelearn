interface AvatarProps {
    name?: string;
    src?: string;
    size?: "sm" | "md" | "lg" | "xl";
    status?: "online" | "offline" | "away";
    className?: string;
}
export default function Avatar({ name, src, size, status, className }: AvatarProps): import("react/jsx-runtime").JSX.Element;
export {};
