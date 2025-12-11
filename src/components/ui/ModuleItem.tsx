import type { ModuleDto } from "../../types/api";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { SupportTypeIcon } from "./SupportTypeIcon";
import ProgressBar from "./ProgressBar";

interface ModuleItemProps {
  module: ModuleDto;
  onComplete?: (moduleId: number) => void;
  loading?: boolean;
  index?: number;
}

export const ModuleItem = ({ module, onComplete, loading = false, index }: ModuleItemProps) => (
  <div className={`group relative flex flex-col gap-4 rounded-xl border-2 p-5 transition-all duration-200 ${
    module.completed
      ? "border-accent-200 bg-accent-50/50"
      : "border-slate-200 bg-white hover:border-primary-300 hover:shadow-md"
  }`}>
    {/* Module Number Badge */}
    {index !== undefined && (
      <div className="absolute -left-3 -top-3 h-8 w-8 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
        {index}
      </div>
    )}

    <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
      <div className="flex flex-1 items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <SupportTypeIcon type={module.type} />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
            {module.title}
          </h3>
          {module.completed && module.completedAt ? (
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-accent-600 flex items-center justify-center text-white text-xs font-bold animate-scale-in">
                ✓
              </div>
              <p className="text-sm text-accent-700 font-medium">
                Completed on {new Date(module.completedAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-600">Click to mark as complete when finished.</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:flex-shrink-0">
        {module.completed ? (
          <Badge variant="success" size="md" dot>
            Completed
          </Badge>
        ) : (
          <Button
            variant="success"
            size="md"
            onClick={() => onComplete?.(module.id)}
            loading={loading}
            disabled={!onComplete || loading}
            icon={
              !loading && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )
            }
          >
            Mark Complete
          </Button>
        )}
      </div>
    </div>
  </div>
);
