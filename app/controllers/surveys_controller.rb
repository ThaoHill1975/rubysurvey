class SurveysController < ApplicationController
  layout "survey"

  def show
    @token = params[:token]
    @survey_review = SurveyReview.find_by(token: @token)
    head :not_found unless @survey_review
  end

  def complete
    render layout: "survey"
  end
end
