interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => (
  <>
    <img
      src="/logo_light.png"
      alt="NexVaultX"
      width={800}
      height={800}
      className={`${className} dark:hidden`}
    />
    <img
      src="/logo_dark.png"
      alt="NexVaultX"
      width={800}
      height={800}
      className={`hidden ${className} dark:block`}
    />
  </>
);

export { Logo };
