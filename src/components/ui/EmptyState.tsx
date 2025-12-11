interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
    <p className="text-lg font-semibold text-gray-900">{title}</p>
    <p className="mt-2 max-w-md text-sm text-gray-500">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);
