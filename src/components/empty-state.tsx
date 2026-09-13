import type { ReactNode } from "react";

interface EmptyStateProps {
  action?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  title: string;
}

const EmptyState = ({ action, description, icon, title }: EmptyStateProps) => (
  <div className="mt-16 flex flex-col items-center text-center">
    {icon ? (
      <div className="border-border bg-muted text-muted-foreground mb-4 flex size-12 items-center justify-center rounded-xl border">
        {icon}
      </div>
    ) : null}
    <p className="text-foreground text-lg font-semibold">{title}</p>
    {description ? (
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    ) : null}
    {action ? <div className="mt-4">{action}</div> : null}
  </div>
);

export { EmptyState };
