import React from "react";
import { createRoot } from "react-dom/client";
import Layout from "../admin/components/Layout";
import Dashboard from "../admin/pages/Dashboard";
import SurveyList from "../admin/pages/SurveyList";
import SurveyForm from "../admin/pages/SurveyForm";
import SurveyDetail from "../admin/pages/SurveyDetail";

import "../ui/Button.scss";
import "../ui/Input.scss";
import "../admin/components/Layout.scss";

interface AppProps {
  page: string;
  currentUser: string;
  surveyId?: string;
}

const AdminApp: React.FC<AppProps> = ({ page, currentUser, surveyId }) => {
  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard />;
      case "surveys/index":
        return <SurveyList />;
      case "surveys/new":
        return <SurveyForm />;
      case "surveys/edit":
        return <SurveyForm surveyId={surveyId} />;
      case "surveys/show":
        return <SurveyDetail surveyId={surveyId!} />;
      default:
        return <Dashboard />;
    }
  };

  return <Layout currentUser={currentUser}>{renderPage()}</Layout>;
};

document.addEventListener("DOMContentLoaded", () => {
  const rootEl = document.getElementById("admin-root");
  if (!rootEl) return;

  const props = JSON.parse(rootEl.dataset.props || "{}");
  const root = createRoot(rootEl);
  root.render(<AdminApp {...props} />);
});
