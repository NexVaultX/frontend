import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <div
    role="alert"
    className="border-destructive/30 bg-destructive/10 text-destructive mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm"
  >
    <span>{message}</span>
    {onRetry ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="min-h-11"
        onClick={onRetry}
      >
        Try again
      </Button>
    ) : null}
  </div>
);

export { ErrorState };
