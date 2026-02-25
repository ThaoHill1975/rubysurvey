require "rails_helper"

RSpec.describe "Api::V1::Reviews", type: :request do
  describe "POST /api/v1/reviews" do
    let(:review_params) do
      {
        review_id: "review-123",
        contract_id: "contract-1",
        contract_vehicle_id: "cv-1",
        reviewer_organization_id: "org-1",
        reviewer_name: "John Doe",
        reviewer_email: "john@example.com",
        review_title: "Great Service",
        supplier_name: "Acme Corp"
      }
    end

    context "when no active surveys exist" do
      it "returns not eligible with no_active_surveys reason" do
        post "/api/v1/reviews", params: review_params, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["survey_eligible"]).to eq(false)
        expect(json["reason"]).to eq("no_active_surveys")
      end
    end

    context "when an active survey exists" do
      let!(:survey) { create(:survey, :published, :with_questions) }

      it "returns eligible and creates a survey review" do
        expect {
          post "/api/v1/reviews", params: review_params, as: :json
        }.to change(SurveyReview, :count).by(1)

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["survey_eligible"]).to eq(true)
        expect(json["survey_review_id"]).to be_present
      end

      it "is idempotent - does not create duplicates" do
        post "/api/v1/reviews", params: review_params, as: :json
        expect(response).to have_http_status(:ok)

        post "/api/v1/reviews", params: review_params, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["reason"]).to eq("already_processed")
      end

      it "enqueues a SendSurveyEmailJob" do
        expect {
          post "/api/v1/reviews", params: review_params, as: :json
        }.to have_enqueued_job(SendSurveyEmailJob)
      end
    end

    context "when payload is invalid" do
      it "returns invalid_payload for missing review_id" do
        post "/api/v1/reviews", params: { contract_id: "c-1" }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["survey_eligible"]).to eq(false)
        expect(json["reason"]).to eq("invalid_payload")
      end
    end

    context "when survey has criteria" do
      let!(:survey) { create(:survey, :published, :with_questions, criteria: { "contract_vehicle_id" => "cv-specific" }) }

      it "returns no_matching_criteria when criteria don't match" do
        post "/api/v1/reviews", params: review_params, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["reason"]).to eq("no_matching_criteria")
      end

      it "returns eligible when criteria match" do
        post "/api/v1/reviews", params: review_params.merge(contract_vehicle_id: "cv-specific"), as: :json
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["survey_eligible"]).to eq(true)
      end
    end
  end
end
