interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => (
  <>
    <img
      src="/logo_light.png"
      alt="NexVaultX"
      className={`${className} dark:hidden`}
    />
    <img
      src="/logo_dark.png"
      alt="NexVaultX"
      className={`hidden ${className} dark:block`}
    />
  </>
);

export { Logo };
