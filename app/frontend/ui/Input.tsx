import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, id, ...props }) => {
  const inputId = id || `input-${label?.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="survey-input-group">
      {label && (
        <label className="survey-input-group__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input className={`survey-input-group__input ${error ? "survey-input-group__input--error" : ""}`} id={inputId} {...props} />
      {error && <span className="survey-input-group__error">{error}</span>}
    </div>
  );
};

export default Input;
