import type { SupportDto } from "../../types/api";
interface SupportItemProps {
    support: SupportDto;
    onAccess?: (supportId: number) => void;
    loading?: boolean;
}
export declare const SupportItem: ({ support, onAccess, loading }: SupportItemProps) => import("react/jsx-runtime").JSX.Element;
export {};
