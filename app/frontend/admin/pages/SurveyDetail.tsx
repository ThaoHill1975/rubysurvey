import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Survey } from "../../lib/types";
import Button from "../../ui/Button";
import "./SurveyDetail.scss";

interface SurveyDetailProps {
  surveyId: string;
}

const SurveyDetail: React.FC<SurveyDetailProps> = ({ surveyId }) => {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Survey>(`/api/v1/surveys/${surveyId}`)
      .then(setSurvey)
      .finally(() => setLoading(false));
  }, [surveyId]);

  if (loading) return <p>Loading...</p>;
  if (!survey) return <p>Survey not found.</p>;

  return (
    <div className="admin-survey-detail">
      <div className="admin-survey-detail__header">
        <div>
          <h1>{survey.title}</h1>
          <span className={`admin-survey-detail__status admin-survey-detail__status--${survey.status}`}>
            {survey.status}
          </span>
        </div>
        <a href={`/admin/surveys/${survey.id}/edit`}>
          <Button variant="primary">Edit Survey</Button>
        </a>
      </div>

      {survey.description && (
        <p className="admin-survey-detail__description">{survey.description}</p>
      )}

      {Object.keys(survey.criteria || {}).length > 0 && (
        <div className="admin-survey-detail__section">
          <h2>Criteria</h2>
          <dl className="admin-survey-detail__criteria">
            {Object.entries(survey.criteria).map(([key, value]) => (
              <React.Fragment key={key}>
                <dt>{key.replace(/_/g, " ")}</dt>
                <dd>{Array.isArray(value) ? value.join(", ") : String(value)}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
      )}

      <div className="admin-survey-detail__section">
        <h2>Questions ({survey.questions.length})</h2>
        {survey.questions.map((q, i) => (
          <div key={q.id || i} className="admin-survey-detail__question">
            <div className="admin-survey-detail__question-num">Q{i + 1}</div>
            <div className="admin-survey-detail__question-body">
              <p className="admin-survey-detail__question-prompt">{q.prompt}</p>
              <div className="admin-survey-detail__question-meta">
                <span>Type: {q.question_type.replace(/_/g, " ")}</span>
                {q.required && <span className="admin-survey-detail__required">Required</span>}
              </div>
              {q.question_type === "multiple_choice" && q.options.length > 0 && (
                <ul className="admin-survey-detail__options">
                  {q.options.map((opt, oi) => (
                    <li key={oi}>{opt}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurveyDetail;
