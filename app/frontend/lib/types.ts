export interface Question {
  id?: number;
  question_type: "free_form" | "rating" | "multiple_choice";
  prompt: string;
  options: string[];
  required: boolean;
  position: number;
  _destroy?: boolean;
}

export interface Survey {
  id: number;
  title: string;
  description: string;
  status: "draft" | "published" | "archived";
  criteria: Record<string, string | string[]>;
  questions: Question[];
  created_at: string;
  updated_at: string;
}

export interface SurveyStats {
  id: number;
  title: string;
  status: string;
  sent: number;
  completed: number;
  pending: number;
}

export interface SurveyCompletionData {
  survey_review_id: number;
  survey: {
    id: number;
    title: string;
    description: string;
  };
  questions: Question[];
  review_context: {
    reviewer_name: string;
    review_title: string;
    supplier_name: string;
    contract_name: string;
  };
}

export interface ResponseAnswer {
  question_id: number;
  answer: string;
}
