import type { CharacterAccent } from './CastCard';
import './film-card.css';

export interface FilmCardProps {
  thumbnail: string;
  title: string;
  episode?: string;
  runtime?: string;
  accent?: CharacterAccent;
  onClick?: () => void;
  className?: string;
}

/**
 * Small film thumbnail card for horizontal scrolling reels.
 */
export function FilmCard({
  thumbnail,
  title,
  episode,
  runtime,
  accent,
  onClick,
  className = '',
}: FilmCardProps) {
  const accentClass = accent ? `ds-film-card--${accent}` : '';

  return (
    <article
      className={`ds-film-card ${accentClass} ${className}`.trim()}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className="ds-film-card__thumb-wrap">
        <img className="ds-film-card__thumb" src={thumbnail} alt={title} />
        {episode && <span className="ds-film-card__episode">{episode}</span>}
      </div>
      <h4 className="ds-film-card__title">{title}</h4>
      {runtime && <p className="ds-film-card__meta">{runtime}</p>}
    </article>
  );
}
