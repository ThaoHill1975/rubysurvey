import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({ label, error, options, id, ...props }) => {
  const inputId = id || `select-${label?.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="survey-input-group">
      {label && (
        <label className="survey-input-group__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <select
        className={`survey-input-group__input ${error ? "survey-input-group__input--error" : ""}`}
        id={inputId}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="survey-input-group__error">{error}</span>}
    </div>
  );
};

export default Select;
