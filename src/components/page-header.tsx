import type { ReactNode } from "react";

interface PageHeaderProps {
  description?: ReactNode;
  title: string;
}

const PageHeader = ({ description, title }: PageHeaderProps) => (
  <header className="max-w-2xl">
    <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
      {title}
    </h1>
    {description ? (
      <p className="text-muted-foreground mt-2 text-sm sm:text-base">
        {description}
      </p>
    ) : null}
  </header>
);

export { PageHeader };
