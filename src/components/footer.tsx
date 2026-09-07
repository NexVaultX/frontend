import {
  IconBox,
  IconBrandDiscord,
  IconBrandGithub,
  IconLicense,
} from "@tabler/icons-react";

const PROJECT_LINKS = [
  { href: "/mods", label: "Mods" },
  { href: "/resource-packs", label: "Resource Packs" },
  { href: "/modpacks", label: "Modpacks" },
  { href: "/shaders", label: "Shaders" },
  { href: "/plugins", label: "Plugins" },
  { href: "/servers", label: "Servers" },
] as const;

const RESOURCE_LINKS = [
  { href: "/docs", label: "Documentation" },
  { href: "/api", label: "API" },
  { href: "/status", label: "Status" },
  { href: "/changelog", label: "Changelog" },
] as const;

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/brand", label: "Brand" },
] as const;

const SOCIAL_LINKS = [
  {
    href: "https://github.com/NexVaultX",
    icon: IconBrandGithub,
    label: "GitHub",
  },
  {
    href: "https://discord.gg/6JKttcu9cc",
    icon: IconBrandDiscord,
    label: "Discord",
  },
] as const;

const Footer = () => (
  <footer className="border-border bg-muted/30 border-t">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
        <div className="col-span-2 lg:col-span-2">
          <a
            href="/"
            className="focus-visible:ring-ring inline-flex min-h-11 items-center gap-2 rounded-md focus-visible:ring-2 focus-visible:outline-none"
          >
            <IconBox size={24} className="text-primary" />
            <span className="text-lg font-semibold tracking-tight">
              NexVaultX
            </span>
          </a>
          <p className="text-muted-foreground mt-3 max-w-xs text-sm">
            The free, open-source platform for discovering, managing, and
            sharing Minecraft content.
          </p>
          <div className="mt-4 flex items-center gap-2">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener"
                aria-label={social.label}
                className="border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/20 focus-visible:ring-ring ease-smooth inline-flex size-11 items-center justify-center rounded-lg border transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none"
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Projects</h3>
          <ul className="space-y-1">
            {PROJECT_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-muted-foreground hover:text-primary focus-visible:ring-ring ease-smooth inline-flex min-h-11 items-center text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Resources</h3>
          <ul className="space-y-1">
            {RESOURCE_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-muted-foreground hover:text-primary focus-visible:ring-ring ease-smooth inline-flex min-h-11 items-center text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Company</h3>
          <ul className="space-y-1">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-muted-foreground hover:text-primary focus-visible:ring-ring ease-smooth inline-flex min-h-11 items-center text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 md:col-span-4 lg:col-span-1">
          <div className="border-border bg-primary/5 text-primary inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium">
            <IconLicense size={16} />
            Open source
          </div>
        </div>
      </div>

      <div className="border-border mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
        <p className="text-muted-foreground text-sm">
          © 2026 NexVaultX. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="/privacy"
            className="text-muted-foreground hover:text-primary focus-visible:ring-ring ease-smooth inline-flex min-h-11 items-center text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="text-muted-foreground hover:text-primary focus-visible:ring-ring ease-smooth inline-flex min-h-11 items-center text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none"
          >
            Terms
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export { Footer };
