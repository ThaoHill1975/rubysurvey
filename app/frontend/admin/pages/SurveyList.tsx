import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Survey } from "../../lib/types";
import Button from "../../ui/Button";
import "./SurveyList.scss";

const SurveyList: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Survey[]>("/api/v1/surveys")
      .then(setSurveys)
      .catch(() => setSurveys([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this survey?")) return;
    try {
      await api.delete(`/api/v1/surveys/${id}`);
      setSurveys((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      alert("Failed to delete survey");
    }
  };

  if (loading) return <p>Loading surveys...</p>;

  return (
    <div className="admin-survey-list">
      <div className="admin-survey-list__header">
        <h1>Surveys</h1>
        <a href="/admin/surveys/new">
          <Button variant="primary">Create Survey</Button>
        </a>
      </div>

      {surveys.length === 0 ? (
        <p className="admin-survey-list__empty">No surveys found.</p>
      ) : (
        <div className="admin-survey-list__grid">
          {surveys.map((survey) => (
            <div key={survey.id} className="admin-survey-list__card">
              <div className="admin-survey-list__card-header">
                <h3>{survey.title}</h3>
                <span className={`admin-survey-list__status admin-survey-list__status--${survey.status}`}>
                  {survey.status}
                </span>
              </div>
              <p className="admin-survey-list__description">
                {survey.description || "No description"}
              </p>
              <div className="admin-survey-list__meta">
                {survey.questions?.length || 0} question(s)
              </div>
              <div className="admin-survey-list__actions">
                <a href={`/admin/surveys/${survey.id}`}>
                  <Button variant="secondary" size="sm">View</Button>
                </a>
                <a href={`/admin/surveys/${survey.id}/edit`}>
                  <Button variant="secondary" size="sm">Edit</Button>
                </a>
                <Button variant="danger" size="sm" onClick={() => handleDelete(survey.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SurveyList;
