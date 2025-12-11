import { ReactNode } from "react";
type ToastTone = "success" | "error" | "info" | "warning";
interface ToastData {
    id: string;
    tone: ToastTone;
    title?: string;
    message: string;
    action?: ReactNode;
    duration?: number;
}
interface ToastContextType {
    addToast: (toast: Omit<ToastData, "id">) => void;
    removeToast: (id: string) => void;
}
export declare function useToast(): ToastContextType;
export declare function ToastProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
