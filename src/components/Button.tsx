import './button.css';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

/**
 * Primary button component.
 *
 * Guidelines: use `primary` for the single main action on a screen,
 * `secondary` for supporting actions, and `danger` only for destructive
 * actions (delete, remove, cancel-with-data-loss).
 */
export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`ds-btn ds-btn--${variant} ds-btn--${size}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}