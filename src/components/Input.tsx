import './input.css';

export type InputVariant = 'field' | 'quiz';

export interface InputProps {
  variant?: InputVariant;
  label?: string;
  placeholder?: string;
  value?: string;
  error?: string;
  disabled?: boolean;
  selected?: boolean;
  onChange?: (value: string) => void;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Text input or quiz option pill.
 *
 * Guidelines: use `field` for labeled form inputs. Use `quiz` for large
 * clickable answer options in the personality quiz section.
 */
export function Input({
  variant = 'field',
  label,
  placeholder,
  value,
  error,
  disabled = false,
  selected = false,
  onChange,
  onClick,
  children,
  className = '',
}: InputProps) {
  if (variant === 'quiz') {
    return (
      <button
        type="button"
        className={`ds-quiz-option ${selected ? 'ds-quiz-option--selected' : ''} ${className}`.trim()}
        disabled={disabled}
        onClick={onClick}
      >
        {children ?? value}
      </button>
    );
  }

  return (
    <div className={`ds-field ${className}`.trim()}>
      {label && <label className="ds-field__label">{label}</label>}
      <input
        className={`ds-field__input ${error ? 'ds-field__input--error' : ''}`}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {error && <span className="ds-field__error">{error}</span>}
    </div>
  );
}
