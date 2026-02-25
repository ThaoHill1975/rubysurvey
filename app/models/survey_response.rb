class SurveyResponse < ApplicationRecord
  belongs_to :survey_review
  belongs_to :question

  validates :question_id, uniqueness: { scope: :survey_review_id }
end
