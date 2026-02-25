module Api
  module V1
    class SurveyCompletionsController < BaseController
      def show
        survey_review = SurveyReview.find_by!(token: params[:token])

        if survey_review.status == "completed"
          render json: { error: "survey_already_completed" }, status: :gone
          return
        end

        survey = survey_review.survey
        render json: {
          survey_review_id: survey_review.id,
          survey: survey.as_json(only: [:id, :title, :description]),
          questions: survey.questions.as_json(only: [:id, :question_type, :prompt, :options, :required, :position]),
          review_context: {
            reviewer_name: survey_review.metadata["reviewer_name"],
            review_title: survey_review.metadata["review_title"],
            supplier_name: survey_review.metadata["supplier_name"],
            contract_name: survey_review.metadata["contract_name"]
          }
        }
      end

      def create
        survey_review = SurveyReview.find_by!(token: params[:token])

        if survey_review.status == "completed"
          render json: { error: "survey_already_completed" }, status: :gone
          return
        end

        unless RecaptchaVerifier.verify(params[:captcha_token])
          render json: { error: "captcha_verification_failed" }, status: :unprocessable_entity
          return
        end

        responses_params = params.require(:responses)
        required_question_ids = survey_review.survey.questions.where(required: true).pluck(:id)
        answered_question_ids = responses_params.map { |r| r[:question_id].to_i }

        missing = required_question_ids - answered_question_ids
        unless missing.empty?
          render json: { error: "missing_required_answers", question_ids: missing }, status: :unprocessable_entity
          return
        end

        ActiveRecord::Base.transaction do
          responses_params.each do |response|
            SurveyResponse.create!(
              survey_review: survey_review,
              question_id: response[:question_id],
              answer: response[:answer].to_s
            )
          end
          survey_review.complete!
        end

        render json: { success: true, message: "Survey completed successfully" }
      end
    end
  end
end
