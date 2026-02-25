require "rails_helper"

RSpec.describe "Api::V1::SurveyCompletions", type: :request do
  let(:survey) { create(:survey, :published, :with_questions) }
  let(:survey_review) { create(:survey_review, survey: survey) }

  describe "GET /api/v1/survey_completions/:token" do
    it "returns survey data for a valid token" do
      get "/api/v1/survey_completions/#{survey_review.token}", as: :json
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["survey"]["id"]).to eq(survey.id)
      expect(json["questions"].length).to eq(3)
    end

    it "returns 404 for an invalid token" do
      get "/api/v1/survey_completions/invalid-token", as: :json
      expect(response).to have_http_status(:not_found)
    end

    it "returns 410 for a completed survey" do
      survey_review.update!(status: "completed")
      get "/api/v1/survey_completions/#{survey_review.token}", as: :json
      expect(response).to have_http_status(:gone)
    end
  end

  describe "POST /api/v1/survey_completions/:token" do
    let(:responses) do
      survey.questions.map do |q|
        { question_id: q.id, answer: "Test answer" }
      end
    end

    it "completes the survey successfully" do
      post "/api/v1/survey_completions/#{survey_review.token}",
        params: { responses: responses }, as: :json

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["success"]).to eq(true)
      expect(survey_review.reload.status).to eq("completed")
    end

    it "persists all responses" do
      expect {
        post "/api/v1/survey_completions/#{survey_review.token}",
          params: { responses: responses }, as: :json
      }.to change(SurveyResponse, :count).by(3)
    end

    it "returns error for missing required answers" do
      survey.questions.first.update!(required: true)
      incomplete_responses = responses.reject { |r| r[:question_id] == survey.questions.first.id }

      post "/api/v1/survey_completions/#{survey_review.token}",
        params: { responses: incomplete_responses }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "prevents completing an already completed survey" do
      post "/api/v1/survey_completions/#{survey_review.token}",
        params: { responses: responses }, as: :json
      expect(response).to have_http_status(:ok)

      post "/api/v1/survey_completions/#{survey_review.token}",
        params: { responses: responses }, as: :json
      expect(response).to have_http_status(:gone)
    end
  end
end
