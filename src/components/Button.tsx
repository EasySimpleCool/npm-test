import './button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'overlay';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

/**
 * Pill-shaped button with Second Act variants.
 *
 * Guidelines: use `primary` for main CTAs, `secondary` for hero supporting actions,
 * `ghost` for low-emphasis links (watch film, quiz pills), `overlay` for controls
 * on image cards.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) {
  return (
    <button
      className={`ds-btn ds-btn--${variant} ds-btn--${size} ${className}`.trim()}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
