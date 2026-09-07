import type { Icon } from "@tabler/icons-react";

import { Reveal } from "@/components/reveal";

interface Feature {
  icon: Icon;
  title: string;
  description: string;
}

interface FeatureSectionProps {
  id: string;
  headingId: string;
  title: string;
  description: string;
  features: Feature[];
}

const FeatureSection = ({
  id,
  headingId,
  title,
  description,
  features,
}: FeatureSectionProps) => (
  <section
    id={id}
    aria-labelledby={headingId}
    className="px-4 py-16 sm:px-6 lg:px-8"
  >
    <div className="mx-auto max-w-7xl">
      <Reveal className="mb-10 max-w-2xl">
        <h2
          id={headingId}
          className="text-2xl font-bold tracking-tight sm:text-3xl"
        >
          {title}
        </h2>
        <p className="text-muted-foreground mt-2">{description}</p>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 0.06}>
            <div className="border-border bg-card ease-smooth h-full rounded-xl border p-6 transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
              <div className="bg-primary/10 text-primary mb-4 inline-flex size-11 items-center justify-center rounded-lg">
                <feature.icon size={22} />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export { FeatureSection };
