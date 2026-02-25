class SurveyReview < ApplicationRecord
  belongs_to :survey
  has_many :survey_responses, dependent: :destroy

  validates :review_id, presence: true, uniqueness: true
  validates :token, presence: true, uniqueness: true
  validates :status, presence: true, inclusion: { in: %w[pending completed expired] }

  before_validation :generate_token, on: :create

  scope :pending, -> { where(status: "pending") }
  scope :completed, -> { where(status: "completed") }

  def complete!
    update!(status: "completed")
  end

  private

  def generate_token
    self.token ||= SecureRandom.urlsafe_base64(32)
  end
end
