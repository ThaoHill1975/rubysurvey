FactoryBot.define do
  factory :survey do
    title { "Customer Satisfaction Survey" }
    description { "Tell us about your experience" }
    status { "draft" }
    criteria { {} }

    trait :published do
      status { "published" }
    end

    trait :with_questions do
      after(:create) do |survey|
        create(:question, :free_form, survey: survey, position: 0)
        create(:question, :rating, survey: survey, position: 1)
        create(:question, :multiple_choice, survey: survey, position: 2)
      end
    end

    trait :with_criteria do
      criteria { { "contract_vehicle_id" => "cv-1" } }
    end
  end
end
