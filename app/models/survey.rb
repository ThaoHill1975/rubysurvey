class Survey < ApplicationRecord
  has_many :questions, -> { order(position: :asc) }, dependent: :destroy
  has_many :survey_reviews, dependent: :destroy

  validates :title, presence: true
  validates :status, presence: true, inclusion: { in: %w[draft published archived] }

  scope :published, -> { where(status: "published") }
  scope :active, -> { published }

  accepts_nested_attributes_for :questions, allow_destroy: true

  def matching_criteria?(review_params)
    return true if criteria.blank?

    criteria.all? do |key, value|
      next true if value.blank?

      review_params[key].present? && Array(value).include?(review_params[key])
    end
  end
end
