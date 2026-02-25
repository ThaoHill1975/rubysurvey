require "rails_helper"

RSpec.describe SurveyReview, type: :model do
  it "generates a token on creation" do
    survey_review = create(:survey_review)
    expect(survey_review.token).to be_present
  end

  it "validates uniqueness of review_id" do
    create(:survey_review, review_id: "r-1")
    duplicate = build(:survey_review, review_id: "r-1")
    expect(duplicate).not_to be_valid
  end

  describe "#complete!" do
    it "marks the review as completed" do
      survey_review = create(:survey_review)
      survey_review.complete!
      expect(survey_review.reload.status).to eq("completed")
    end
  end
end
