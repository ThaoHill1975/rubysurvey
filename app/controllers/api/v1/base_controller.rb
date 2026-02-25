module Api
  module V1
    class BaseController < ActionController::API
      rescue_from ActiveRecord::RecordNotFound, with: :not_found
      rescue_from ActionController::ParameterMissing, with: :bad_request

      private

      def not_found
        render json: { error: "not_found" }, status: :not_found
      end

      def bad_request(exception)
        render json: { error: "bad_request", message: exception.message }, status: :bad_request
      end
    end
  end
end
