import './nav-link.css';

export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  onDark?: boolean;
  className?: string;
}

/**
 * Uppercase mono nav link for the site navigation.
 */
export function NavLink({
  href,
  children,
  active = false,
  onDark = true,
  className = '',
}: NavLinkProps) {
  return (
    <a
      href={href}
      className={`ds-nav-link ${onDark ? 'ds-nav-link--on-dark' : ''} ${active ? 'ds-nav-link--active' : ''} ${className}`.trim()}
    >
      {children}
    </a>
  );
}
