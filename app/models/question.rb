class Question < ApplicationRecord
  belongs_to :survey
  has_many :survey_responses, dependent: :destroy

  validates :question_type, presence: true, inclusion: { in: %w[free_form rating multiple_choice] }
  validates :prompt, presence: true
  validates :position, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
