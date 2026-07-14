import { Button } from './Button';
import { NavLink } from './NavLink';
import './nav-bar.css';

export interface NavBarLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavBarProps {
  logo?: React.ReactNode;
  links: NavBarLink[];
  cta?: React.ReactNode;
  sticky?: boolean;
  className?: string;
}

/**
 * Top navigation bar — logo left, links center, primary CTA right.
 */
export function NavBar({
  logo,
  links,
  cta,
  sticky = false,
  className = '',
}: NavBarProps) {
  return (
    <header
      className={`ds-nav-bar ${sticky ? 'ds-nav-bar--sticky' : ''} ${className}`.trim()}
    >
      <div className="ds-nav-bar__inner">
        <div className="ds-nav-bar__logo">{logo}</div>
        <nav className="ds-nav-bar__links" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              active={link.active}
              onDark
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="ds-nav-bar__cta">
          {cta ?? <Button variant="primary">Save my seat</Button>}
        </div>
      </div>
    </header>
  );
}
