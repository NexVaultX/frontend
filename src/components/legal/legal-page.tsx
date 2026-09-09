import type { ReactNode } from "react";

interface LegalSection {
  heading: string;
  body: ReactNode;
}

interface LegalPageProps {
  title: string;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/gu, "-")
    .replaceAll(/^-|-$/gu, "");

const LegalPage = ({ title, updated, intro, sections }: LegalPageProps) => (
  <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
    <header>
      <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Last updated: {updated}
      </p>
    </header>

    <div className="mt-8 space-y-8 text-sm leading-7">
      <p className="text-muted-foreground">{intro}</p>

      {sections.map((section) => (
        <section
          key={section.heading}
          aria-labelledby={slugify(section.heading)}
        >
          <h2
            id={slugify(section.heading)}
            className="text-foreground text-lg font-semibold"
          >
            {section.heading}
          </h2>
          <div className="text-muted-foreground mt-2">{section.body}</div>
        </section>
      ))}
    </div>
  </div>
);

export { LegalPage };
