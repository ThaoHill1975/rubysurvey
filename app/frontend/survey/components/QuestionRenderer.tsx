import React from "react";
import { Question } from "../../lib/types";
import "./QuestionRenderer.scss";

interface QuestionRendererProps {
  question: Question;
  index: number;
  value: string;
  onChange: (value: string) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  index,
  value,
  onChange,
}) => {
  return (
    <div className="question-renderer">
      <label className="question-renderer__label">
        {index + 1}. {question.prompt}
        {question.required && <span className="question-renderer__required"> *</span>}
      </label>

      {question.question_type === "free_form" && (
        <textarea
          className="question-renderer__textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder="Enter your answer..."
        />
      )}

      {question.question_type === "rating" && (
        <div className="question-renderer__rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`question-renderer__rating-btn ${value === String(n) ? "question-renderer__rating-btn--active" : ""}`}
              onClick={() => onChange(String(n))}
            >
              {n}
            </button>
          ))}
          <div className="question-renderer__rating-labels">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>
      )}

      {question.question_type === "multiple_choice" && (
        <div className="question-renderer__choices">
          {question.options.map((opt, i) => (
            <label key={i} className="question-renderer__choice">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionRenderer;
