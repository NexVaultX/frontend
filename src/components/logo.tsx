interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => (
  <>
    <img
      src="/logo_light.png"
      alt="OpenVault"
      className={`${className} dark:hidden`}
    />
    <img
      src="/logo_dark.png"
      alt="OpenVault"
      className={`hidden ${className} dark:block`}
    />
  </>
);

export { Logo };
