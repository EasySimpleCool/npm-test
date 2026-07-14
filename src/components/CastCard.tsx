import { Button } from './Button';
import './cast-card.css';

export type CharacterAccent =
  | 'teal'
  | 'gold'
  | 'terracotta'
  | 'purple'
  | 'green';

export interface CastCardAction {
  label: string;
  onClick?: () => void;
}

export interface CastCardProps {
  image: string;
  name: string;
  description: string;
  characterTheme?: CharacterAccent;
  actions?: CastCardAction[];
  className?: string;
}

/**
 * Large character profile card with image, gradient scrim, and overlay text.
 */
export function CastCard({
  image,
  name,
  description,
  characterTheme,
  actions,
  className = '',
}: CastCardProps) {
  const themeClass = characterTheme ? `ds-cast-card--${characterTheme}` : '';

  return (
    <article className={`ds-cast-card ${themeClass} ${className}`.trim()}>
      <img className="ds-cast-card__image" src={image} alt={name} />
      <div className="ds-cast-card__scrim" aria-hidden="true" />
      {actions && actions.length > 0 && (
        <div className="ds-cast-card__actions">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="overlay"
              size="sm"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
      <div className="ds-cast-card__content">
        <h3 className="ds-cast-card__name">{name}</h3>
        <p className="ds-cast-card__description">{description}</p>
      </div>
    </article>
  );
}
