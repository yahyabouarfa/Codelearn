import type { SupportDto } from "../../types/api";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { SupportTypeIcon } from "./SupportTypeIcon";

interface SupportItemProps {
  support: SupportDto;
  onAccess?: (supportId: number) => void;
  loading?: boolean;
}

export const SupportItem = ({ support, onAccess, loading = false }: SupportItemProps) => {
  const typeColor: "primary" | "success" = support.type === "VIDEO" || support.type === "Video" ? "primary" : "success";
  
  return (
    <div className="group flex flex-col gap-4 rounded-xl border-2 border-slate-200 bg-white p-5 hover:border-primary-300 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-start sm:justify-between">
        <div className="flex flex-1 items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <SupportTypeIcon type={support.type} />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-2">
              <h3 className="text-base font-bold text-slate-900 flex-1 group-hover:text-primary-700 transition-colors">
                {support.title}
              </h3>
              <Badge variant={typeColor} size="sm">
                {support.type}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {support.description}
            </p>
          </div>
        </div>

        <div className="sm:flex-shrink-0">
          <Button
            variant="outline"
            size="md"
            onClick={() => onAccess?.(support.id)}
            loading={loading}
            disabled={!onAccess || loading}
            icon={
              !loading && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )
            }
          >
            Access Resource
          </Button>
        </div>
      </div>
    </div>
  );
};
