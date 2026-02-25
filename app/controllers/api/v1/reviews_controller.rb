module Api
  module V1
    class ReviewsController < BaseController
      def create
        result = SurveyEligibilityService.new(review_params).call
        status = result[:survey_eligible] ? :ok : :unprocessable_entity
        render json: result, status: status
      end

      private

      def review_params
        params.permit(
          :review_id, :contract_id, :contract_vehicle_id,
          :reviewer_organization_id, :reviewer_name, :reviewer_email,
          :review_title, :supplier_name, :contract_name
        )
      end
    end
  end
end
