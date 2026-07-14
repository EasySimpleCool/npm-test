import './input.css';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  error?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

/**
 * Text input with an optional label and error state.
 *
 * Guidelines: always pair with a `label` when the input isn't obviously
 * self-explanatory from surrounding context. Use `error` to show validation
 * feedback rather than a separate error component.
 */
export function Input({
  label,
  placeholder,
  value,
  error,
  disabled = false,
  onChange,
}: InputProps) {
  return (
    <div className="ds-field">
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
