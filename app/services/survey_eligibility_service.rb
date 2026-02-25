class SurveyEligibilityService
  REQUIRED_FIELDS = %w[review_id].freeze

  def initialize(params)
    @params = params.to_h.with_indifferent_access
  end

  def call
    unless valid_payload?
      return { survey_eligible: false, reason: "invalid_payload" }
    end

    if already_processed?
      return { survey_eligible: false, reason: "already_processed" }
    end

    active_surveys = Survey.active
    if active_surveys.empty?
      return { survey_eligible: false, reason: "no_active_surveys" }
    end

    matching_survey = find_matching_survey(active_surveys)
    unless matching_survey
      return { survey_eligible: false, reason: "no_matching_criteria" }
    end

    survey_review = create_survey_review(matching_survey)
    SendSurveyEmailJob.perform_later(survey_review.id)

    { survey_eligible: true, survey_review_id: survey_review.id }
  end

  private

  def valid_payload?
    REQUIRED_FIELDS.all? { |f| @params[f].present? }
  end

  def already_processed?
    SurveyReview.exists?(review_id: @params[:review_id])
  end

  def find_matching_survey(surveys)
    review_criteria = {
      "contract_id" => @params[:contract_id],
      "contract_vehicle_id" => @params[:contract_vehicle_id],
      "reviewer_organization_id" => @params[:reviewer_organization_id]
    }

    surveys.find { |s| s.matching_criteria?(review_criteria) }
  end

  def create_survey_review(survey)
    SurveyReview.create!(
      survey: survey,
      review_id: @params[:review_id],
      contract_id: @params[:contract_id],
      contract_vehicle_id: @params[:contract_vehicle_id],
      reviewer_organization_id: @params[:reviewer_organization_id],
      metadata: @params.except(*REQUIRED_FIELDS, :contract_id, :contract_vehicle_id, :reviewer_organization_id)
    )
  end
end
