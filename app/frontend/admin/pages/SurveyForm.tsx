import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Survey, Question } from "../../lib/types";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import TextArea from "../../ui/TextArea";
import Select from "../../ui/Select";
import "./SurveyForm.scss";

interface SurveyFormProps {
  surveyId?: string;
}

const emptyQuestion = (): Question => ({
  question_type: "free_form",
  prompt: "",
  options: [],
  required: false,
  position: 0,
});

const SurveyForm: React.FC<SurveyFormProps> = ({ surveyId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [questions, setQuestions] = useState<Question[]>([emptyQuestion()]);
  const [criteriaContractId, setCriteriaContractId] = useState("");
  const [criteriaVehicleId, setCriteriaVehicleId] = useState("");
  const [criteriaOrgId, setCriteriaOrgId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!surveyId;

  useEffect(() => {
    if (surveyId) {
      api.get<Survey>(`/api/v1/surveys/${surveyId}`).then((survey) => {
        setTitle(survey.title);
        setDescription(survey.description || "");
        setStatus(survey.status);
        setQuestions(survey.questions.length > 0 ? survey.questions : [emptyQuestion()]);
        setCriteriaContractId(survey.criteria?.contract_id as string || "");
        setCriteriaVehicleId(survey.criteria?.contract_vehicle_id as string || "");
        setCriteriaOrgId(survey.criteria?.reviewer_organization_id as string || "");
      });
    }
  }, [surveyId]);

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { ...emptyQuestion(), position: prev.length }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      if (updated[index].id) {
        updated[index] = { ...updated[index], _destroy: true };
      } else {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  const updateQuestion = (index: number, field: keyof Question, value: unknown) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const criteria: Record<string, string> = {};
    if (criteriaContractId) criteria.contract_id = criteriaContractId;
    if (criteriaVehicleId) criteria.contract_vehicle_id = criteriaVehicleId;
    if (criteriaOrgId) criteria.reviewer_organization_id = criteriaOrgId;

    const payload = {
      survey: {
        title,
        description,
        status,
        criteria,
        questions_attributes: questions.map((q, i) => ({
          id: q.id,
          question_type: q.question_type,
          prompt: q.prompt,
          options: q.options,
          required: q.required,
          position: i,
          _destroy: q._destroy || false,
        })),
      },
    };

    try {
      if (isEdit) {
        await api.patch(`/api/v1/surveys/${surveyId}`, payload);
      } else {
        await api.post("/api/v1/surveys", payload);
      }
      window.location.href = "/admin/surveys";
    } catch (err: unknown) {
      const apiError = err as { errors?: string[] };
      setError(apiError.errors?.join(", ") || "Failed to save survey");
    } finally {
      setSaving(false);
    }
  };

  const visibleQuestions = questions.filter((q) => !q._destroy);

  return (
    <div className="admin-survey-form">
      <h1>{isEdit ? "Edit Survey" : "Create Survey"}</h1>

      {error && <div className="admin-survey-form__error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="admin-survey-form__section">
          <h2>Survey Details</h2>
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <TextArea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" },
            ]}
          />
        </div>

        <div className="admin-survey-form__section">
          <h2>Criteria (optional)</h2>
          <p className="admin-survey-form__help">
            Set criteria to control which reviews trigger this survey. Leave blank to match all reviews.
          </p>
          <Input label="Contract ID" value={criteriaContractId} onChange={(e) => setCriteriaContractId(e.target.value)} />
          <Input label="Contract Vehicle ID" value={criteriaVehicleId} onChange={(e) => setCriteriaVehicleId(e.target.value)} />
          <Input label="Reviewer Organization ID" value={criteriaOrgId} onChange={(e) => setCriteriaOrgId(e.target.value)} />
        </div>

        <div className="admin-survey-form__section">
          <div className="admin-survey-form__section-header">
            <h2>Questions</h2>
            <Button type="button" variant="secondary" size="sm" onClick={addQuestion}>
              Add Question
            </Button>
          </div>

          {visibleQuestions.map((q, displayIndex) => {
            const realIndex = questions.indexOf(q);
            return (
              <div key={realIndex} className="admin-survey-form__question">
                <div className="admin-survey-form__question-header">
                  <span>Question {displayIndex + 1}</span>
                  {visibleQuestions.length > 1 && (
                    <Button type="button" variant="danger" size="sm" onClick={() => removeQuestion(realIndex)}>
                      Remove
                    </Button>
                  )}
                </div>
                <Select
                  label="Type"
                  value={q.question_type}
                  onChange={(e) => updateQuestion(realIndex, "question_type", e.target.value)}
                  options={[
                    { value: "free_form", label: "Free Form" },
                    { value: "rating", label: "Rating (1-5)" },
                    { value: "multiple_choice", label: "Multiple Choice" },
                  ]}
                />
                <TextArea
                  label="Prompt"
                  value={q.prompt}
                  onChange={(e) => updateQuestion(realIndex, "prompt", e.target.value)}
                  required
                />
                {q.question_type === "multiple_choice" && (
                  <Input
                    label="Options (comma-separated)"
                    value={q.options.join(", ")}
                    onChange={(e) =>
                      updateQuestion(
                        realIndex,
                        "options",
                        e.target.value.split(",").map((o) => o.trim()).filter(Boolean)
                      )
                    }
                  />
                )}
                <label className="admin-survey-form__checkbox">
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={(e) => updateQuestion(realIndex, "required", e.target.checked)}
                  />
                  Required
                </label>
              </div>
            );
          })}
        </div>

        <div className="admin-survey-form__actions">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Update Survey" : "Create Survey"}
          </Button>
          <a href="/admin/surveys">
            <Button type="button" variant="secondary">Cancel</Button>
          </a>
        </div>
      </form>
    </div>
  );
};

export default SurveyForm;
