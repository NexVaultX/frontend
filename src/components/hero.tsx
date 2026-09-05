import { IconArrowRight } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import logo from "@/logo.png";

const Hero = () => (
  <section className="page-enter px-4 pt-14 pb-12 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-4xl text-center">
      {/* NextVault Logo */}
      <div className="mb-8 flex justify-center">
        <img src={logo} alt="NextVault" className="h-20 w-20 object-contain" />
      </div>

      <h1 className="text-foreground mb-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
        Discover the best <span className="text-foreground">Minecraft</span>{" "}
        projects
      </h1>

      <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg leading-8">
        Discover mods, modpacks, resource packs, shaders, plugins, and more from
        the Minecraft community.
      </p>

      <div className="flex items-center justify-center">
        <Button
          variant="default"
          size="lg"
          className="ease-smooth min-h-11 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
        >
          Browse Projects
          <IconArrowRight size={16} />
        </Button>
      </div>
    </div>
  </section>
);

export { Hero };
