import type { ModuleDto } from "../../types/api";
interface ModuleItemProps {
    module: ModuleDto;
    onComplete?: (moduleId: number) => void;
    loading?: boolean;
    index?: number;
}
export declare const ModuleItem: ({ module, onComplete, loading, index }: ModuleItemProps) => import("react/jsx-runtime").JSX.Element;
export {};
