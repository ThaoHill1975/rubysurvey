import React, { useEffect, useState, useCallback } from "react";
import { api } from "../../lib/api";
import { SurveyCompletionData, ResponseAnswer } from "../../lib/types";
import QuestionRenderer from "../components/QuestionRenderer";
import Button from "../../ui/Button";
import "./TakeSurvey.scss";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface TakeSurveyProps {
  token: string;
}

const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

const TakeSurvey: React.FC<TakeSurveyProps> = ({ token }) => {
  const [data, setData] = useState<SurveyCompletionData | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  useEffect(() => {
    api
      .get<SurveyCompletionData>(`/api/v1/survey_completions/${token}`)
      .then(setData)
      .catch((err) => {
        if (err.status === 410) {
          setAlreadyCompleted(true);
        } else {
          setError("Survey not found or no longer available.");
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const setAnswer = useCallback((questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    const requiredMissing = data.questions
      .filter((q) => q.required)
      .filter((q) => !answers[q.id!] || answers[q.id!].trim() === "");

    if (requiredMissing.length > 0) {
      setError("Please answer all required questions.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      let captchaToken = "";
      if (window.grecaptcha) {
        captchaToken = await new Promise<string>((resolve) => {
          window.grecaptcha!.ready(async () => {
            const t = await window.grecaptcha!.execute(RECAPTCHA_SITE_KEY, {
              action: "submit_survey",
            });
            resolve(t);
          });
        });
      }

      const responses: ResponseAnswer[] = Object.entries(answers).map(([qId, answer]) => ({
        question_id: parseInt(qId, 10),
        answer,
      }));

      await api.post(`/api/v1/survey_completions/${token}`, {
        responses,
        captcha_token: captchaToken,
      });

      setCompleted(true);
    } catch (err: unknown) {
      const apiError = err as { error?: string };
      setError(apiError.error || "Failed to submit survey. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="survey-take__loading">
        <p>Loading survey...</p>
      </div>
    );
  }

  if (alreadyCompleted || completed) {
    return (
      <div className="survey-take__complete">
        <div className="survey-take__complete-card">
          <h1>Thank You!</h1>
          <p>Your survey response has been recorded. We appreciate your feedback.</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="survey-take__error">
        <p>{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="survey-take">
      <div className="survey-take__card">
        <div className="survey-take__header">
          <h1>{data.survey.title}</h1>
          {data.survey.description && <p>{data.survey.description}</p>}
        </div>

        {data.review_context.supplier_name && (
          <div className="survey-take__context">
            <p>
              Regarding your review
              {data.review_context.review_title && <> "{data.review_context.review_title}"</>}
              {data.review_context.supplier_name && <> for <strong>{data.review_context.supplier_name}</strong></>}
            </p>
          </div>
        )}

        {error && <div className="survey-take__form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {data.questions.map((question, index) => (
            <QuestionRenderer
              key={question.id}
              question={question}
              index={index}
              value={answers[question.id!] || ""}
              onChange={(val) => setAnswer(question.id!, val)}
            />
          ))}

          <div className="survey-take__submit">
            <Button type="submit" variant="primary" size="lg" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Survey"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TakeSurvey;
