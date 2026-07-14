import './marquee-ticker.css';

export interface MarqueeTickerProps {
  text: string;
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

/**
 * Repeating horizontal announcement strip with mono uppercase text.
 */
export function MarqueeTicker({
  text,
  speed = 30,
  pauseOnHover = true,
  className = '',
}: MarqueeTickerProps) {
  const repeated = Array(8).fill(text).join(' · ');

  return (
    <div
      className={`ds-marquee ${pauseOnHover ? 'ds-marquee--pause-on-hover' : ''} ${className}`.trim()}
      style={{ '--ds-marquee-speed': `${speed}s` } as React.CSSProperties}
    >
      <div className="ds-marquee__track" aria-hidden="true">
        <span className="ds-marquee__text">{repeated}</span>
        <span className="ds-marquee__text">{repeated}</span>
      </div>
      <span className="ds-marquee__sr-only">{text}</span>
    </div>
  );
}
