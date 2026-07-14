import { useEffect, useState } from 'react';
import './countdown-timer.css';

export interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface CountdownTimerProps {
  targetDate?: Date | string;
  values?: CountdownValues;
  accentLastUnit?: boolean;
  className?: string;
}

function pad(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0');
}

function computeRemaining(target: Date): CountdownValues {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const UNITS: { key: keyof CountdownValues; label: string }[] = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
];

/**
 * Large display countdown with Anton numerals and gold accent on seconds.
 */
export function CountdownTimer({
  targetDate,
  values,
  accentLastUnit = true,
  className = '',
}: CountdownTimerProps) {
  const [remaining, setRemaining] = useState<CountdownValues>(() => {
    if (values) return values;
    if (targetDate) return computeRemaining(new Date(targetDate));
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  });

  useEffect(() => {
    if (values) {
      setRemaining(values);
      return;
    }
    if (!targetDate) return;

    const target = new Date(targetDate);
    const tick = () => setRemaining(computeRemaining(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate, values]);

  return (
    <div className={`ds-countdown ${className}`.trim()} role="timer" aria-live="polite">
      {UNITS.map((unit, index) => {
        const isLast = index === UNITS.length - 1;
        const isAccent = accentLastUnit && isLast;
        return (
          <div key={unit.key} className="ds-countdown__group">
            <div className="ds-countdown__unit">
              <span
                className={`ds-countdown__numeral ${isAccent ? 'ds-countdown__numeral--accent' : ''}`}
              >
                {pad(remaining[unit.key])}
              </span>
              <span className="ds-countdown__label">{unit.label}</span>
            </div>
            {!isLast && (
              <span className="ds-countdown__separator" aria-hidden="true">
                :
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
