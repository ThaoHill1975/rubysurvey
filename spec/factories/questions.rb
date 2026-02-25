FactoryBot.define do
  factory :question do
    association :survey
    prompt { "How was your experience?" }
    question_type { "free_form" }
    options { [] }
    required { false }
    position { 0 }

    trait :free_form do
      question_type { "free_form" }
      prompt { "Please describe your experience" }
    end

    trait :rating do
      question_type { "rating" }
      prompt { "Rate the service quality" }
    end

    trait :multiple_choice do
      question_type { "multiple_choice" }
      prompt { "Would you recommend this vendor?" }
      options { ["Yes", "No", "Maybe"] }
    end

    trait :required do
      required { true }
    end
  end
end
