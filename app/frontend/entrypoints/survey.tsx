import React from "react";
import { createRoot } from "react-dom/client";
import TakeSurvey from "../survey/pages/TakeSurvey";

import "../ui/Button.scss";
import "../ui/Input.scss";

interface AppProps {
  page: string;
  token?: string;
}

const SurveyApp: React.FC<AppProps> = ({ page, token }) => {
  if (page === "complete") {
    return (
      <div className="survey-take__complete">
        <div className="survey-take__complete-card">
          <h1>Thank You!</h1>
          <p>Your survey response has been recorded.</p>
        </div>
      </div>
    );
  }

  if (page === "take_survey" && token) {
    return <TakeSurvey token={token} />;
  }

  return <p>Invalid survey link.</p>;
};

document.addEventListener("DOMContentLoaded", () => {
  const rootEl = document.getElementById("survey-root");
  if (!rootEl) return;

  const props = JSON.parse(rootEl.dataset.props || "{}");
  const root = createRoot(rootEl);
  root.render(<SurveyApp {...props} />);
});
