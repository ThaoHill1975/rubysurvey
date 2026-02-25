class CreateSurveyReviews < ActiveRecord::Migration[7.1]
  def change
    create_table :survey_reviews do |t|
      t.references :survey, null: false, foreign_key: true
      t.string :review_id, null: false
      t.string :contract_id
      t.string :contract_vehicle_id
      t.string :reviewer_organization_id
      t.jsonb :metadata, null: false, default: {}
      t.string :token, null: false
      t.string :status, null: false, default: "pending"
      t.boolean :email_sent, null: false, default: false
      t.timestamps
    end

    add_index :survey_reviews, :review_id, unique: true
    add_index :survey_reviews, :token, unique: true
    add_index :survey_reviews, :status
  end
end
