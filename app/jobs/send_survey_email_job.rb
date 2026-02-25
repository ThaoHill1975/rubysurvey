class SendSurveyEmailJob < ApplicationJob
  queue_as :default

  def perform(survey_review_id)
    survey_review = SurveyReview.find(survey_review_id)
    return if survey_review.email_sent?

    survey_review.update!(email_sent: true)
  end
end
