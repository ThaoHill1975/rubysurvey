class CreateSurveyResponses < ActiveRecord::Migration[7.1]
  def change
    create_table :survey_responses do |t|
      t.references :survey_review, null: false, foreign_key: true
      t.references :question, null: false, foreign_key: true
      t.text :answer
      t.timestamps
    end

    add_index :survey_responses, [:survey_review_id, :question_id], unique: true
  end
end
