import './section-container.css';

export type SectionVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent-teal'
  | 'accent-gold'
  | 'accent-terracotta'
  | 'accent-purple'
  | 'accent-green';

export interface SectionContainerProps {
  variant?: SectionVariant;
  id?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Full-width page section with alternating warm or accent backgrounds.
 */
export function SectionContainer({
  variant = 'primary',
  id,
  children,
  className = '',
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={`ds-section ds-section--${variant} ${className}`.trim()}
    >
      <div className="ds-section__inner">{children}</div>
    </section>
  );
}
