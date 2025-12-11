import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { cn } from "../../utils/classNames";

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

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

const toneStyles: Record<ToastTone, string> = {
  success: "border-accent-300 bg-accent-50 text-accent-900",
  error: "border-red-300 bg-red-50 text-red-900",
  info: "border-primary-300 bg-primary-50 text-primary-900",
  warning: "border-warm-300 bg-warm-50 text-warm-900",
};

const toneIcons: Record<ToastTone, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
};

interface ToastProps extends ToastData {
  onClose: () => void;
}

function Toast({ id, tone, title, message, action, onClose }: ToastProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border-2 px-4 py-3 shadow-xl backdrop-blur-sm animate-slide-in-right min-w-[320px] max-w-md",
        toneStyles[tone]
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm",
          tone === "success" && "bg-accent-600 text-white",
          tone === "error" && "bg-red-600 text-white",
          tone === "info" && "bg-primary-600 text-white",
          tone === "warning" && "bg-warm-600 text-white"
        )}
      >
        {toneIcons[tone]}
      </div>
      <div className="flex-1 space-y-1">
        {title && <p className="text-sm font-bold">{title}</p>}
        <p className="text-sm font-medium">{message}</p>
        {action && <div className="mt-2">{action}</div>}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Close notification"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastData = { ...toast, id };
    
    setToasts((prev) => {
      // Limit to 3 toasts
      const updated = [...prev, newToast];
      return updated.slice(-3);
    });

    // Auto-remove after duration
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Container - fixed top-right */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
