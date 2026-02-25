FactoryBot.define do
  factory :survey_review do
    association :survey
    sequence(:review_id) { |n| "review-#{n}" }
    contract_id { "contract-1" }
    contract_vehicle_id { "cv-1" }
    reviewer_organization_id { "org-1" }
    metadata { { "reviewer_name" => "John Doe", "reviewer_email" => "john@example.com" } }
    status { "pending" }
  end
end
