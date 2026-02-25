require "rails_helper"

RSpec.describe Survey, type: :model do
  it "validates presence of title" do
    survey = build(:survey, title: nil)
    expect(survey).not_to be_valid
  end

  it "validates status inclusion" do
    survey = build(:survey, status: "invalid")
    expect(survey).not_to be_valid
  end

  describe ".published" do
    it "returns only published surveys" do
      create(:survey, status: "draft")
      published = create(:survey, :published)
      expect(Survey.published).to eq([published])
    end
  end

  describe "#matching_criteria?" do
    it "returns true when criteria is empty" do
      survey = build(:survey, criteria: {})
      expect(survey.matching_criteria?({})).to be true
    end

    it "returns true when criteria match" do
      survey = build(:survey, criteria: { "contract_id" => "c-1" })
      expect(survey.matching_criteria?({ "contract_id" => "c-1" })).to be true
    end

    it "returns false when criteria don't match" do
      survey = build(:survey, criteria: { "contract_id" => "c-1" })
      expect(survey.matching_criteria?({ "contract_id" => "c-2" })).to be false
    end
  end
end
