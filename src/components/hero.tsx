"use client";

import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { m, useReducedMotion } from "motion/react";

import { Logo } from "@/components/logo";
import { ChromaticTextReveal } from "@/components/motion/chromatic-text-reveal";
import { Button } from "@/components/ui/button";
import { EASE_OUT } from "@/lib/ease";

const Hero = () => {
  const reduced = useReducedMotion();

  return (
    <section className="px-4 pt-14 pb-12 sm:px-6 lg:px-8">
      <m.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="mx-auto max-w-4xl text-center"
      >
        <div className="mb-8 flex justify-center">
          <Logo className="h-20 w-20 object-contain" />
        </div>

        <h1 className="text-foreground mb-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Discover the best <ChromaticTextReveal /> projects
        </h1>

        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg leading-8">
          Discover mods, modpacks, resource packs, shaders, plugins, and more
          from the Minecraft community.
        </p>

        <m.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: EASE_OUT }}
          className="flex items-center justify-center"
        >
          <Button
            render={<Link to="/projects" />}
            variant="default"
            size="lg"
            className="ease-smooth min-h-11 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
          >
            Browse Projects
            <IconArrowRight size={16} />
          </Button>
        </m.div>
      </m.div>
    </section>
  );
};

export { Hero };
