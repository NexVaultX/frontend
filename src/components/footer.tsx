import {
  IconBox,
  IconBrandDiscord,
  IconBrandGithub,
  IconLicense,
} from "@tabler/icons-react";

const PROJECT_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/mods", label: "Mods" },
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

const LINK_CLASS =
  "text-muted-foreground hover:text-primary focus-visible:ring-ring ease-smooth inline-flex min-h-11 items-center text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none";

const Footer = () => (
  <footer className="border-border bg-muted/30 border-t">
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {/* Branding */}
        <div className="sm:col-span-2">
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
          <div className="border-border bg-primary/5 text-primary mt-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium">
            <IconLicense size={16} />
            Open source
          </div>
        </div>

        {/* Projects */}
        <nav aria-label="Project links">
          <h3 className="mb-3 text-sm font-semibold">Projects</h3>
          <ul className="space-y-1">
            {PROJECT_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={LINK_CLASS}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Resources */}
        <nav aria-label="Resource links">
          <h3 className="mb-3 text-sm font-semibold">Resources</h3>
          <ul className="space-y-1">
            {RESOURCE_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={LINK_CLASS}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Company */}
        <nav aria-label="Company links">
          <h3 className="mb-3 text-sm font-semibold">Company</h3>
          <ul className="space-y-1">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={LINK_CLASS}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="border-border mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} NexVaultX. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end">
          <a href="/impressum" className={LINK_CLASS}>
            Impressum
          </a>
          <a href="/privacy" className={LINK_CLASS}>
            Privacy
          </a>
          <a href="/cookies" className={LINK_CLASS}>
            Cookies
          </a>
          <a href="/terms" className={LINK_CLASS}>
            Terms
          </a>
          <a href="/terms-of-use" className={LINK_CLASS}>
            Terms of Use
          </a>
          <a href="/disclaimer" className={LINK_CLASS}>
            Disclaimer
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export { Footer };
