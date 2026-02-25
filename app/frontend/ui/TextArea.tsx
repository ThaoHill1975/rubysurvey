import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, error, id, ...props }) => {
  const inputId = id || `textarea-${label?.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="survey-input-group">
      {label && (
        <label className="survey-input-group__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <textarea
        className={`survey-input-group__input ${error ? "survey-input-group__input--error" : ""}`}
        id={inputId}
        rows={4}
        {...props}
      />
      {error && <span className="survey-input-group__error">{error}</span>}
    </div>
  );
};

export default TextArea;
