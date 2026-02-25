module Api
  module V1
    class SurveysController < BaseController
      include ActionController::Cookies
      include ActionController::RequestForgeryProtection

      protect_from_forgery with: :exception

      before_action :authenticate_admin!, only: [:index, :show, :create, :update, :destroy, :stats]

      def index
        surveys = Survey.all.order(created_at: :desc)
        render json: surveys.as_json(include: { questions: { only: [:id, :question_type, :prompt, :options, :required, :position] } })
      end

      def show
        survey = Survey.find(params[:id])
        render json: survey.as_json(include: { questions: { only: [:id, :question_type, :prompt, :options, :required, :position] } })
      end

      def create
        survey = Survey.new(survey_params)
        if survey.save
          render json: survey.as_json(include: :questions), status: :created
        else
          render json: { errors: survey.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        survey = Survey.find(params[:id])
        if survey.update(survey_params)
          render json: survey.as_json(include: :questions)
        else
          render json: { errors: survey.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        survey = Survey.find(params[:id])
        survey.destroy!
        render json: { success: true }
      end

      def stats
        surveys = Survey.all
        data = surveys.map do |survey|
          {
            id: survey.id,
            title: survey.title,
            status: survey.status,
            sent: survey.survey_reviews.count,
            completed: survey.survey_reviews.completed.count,
            pending: survey.survey_reviews.pending.count
          }
        end
        render json: data
      end

      private

      def authenticate_admin!
        admin = request.env["warden"]&.authenticate(scope: :admin_user)
        render json: { error: "unauthorized" }, status: :unauthorized unless admin
      end

      def survey_params
        params.require(:survey).permit(
          :title, :description, :status,
          criteria: {},
          questions_attributes: [:id, :question_type, :prompt, :required, :position, :_destroy, options: []]
        )
      end
    end
  end
end
