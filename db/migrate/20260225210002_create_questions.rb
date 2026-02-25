class CreateQuestions < ActiveRecord::Migration[7.1]
  def change
    create_table :questions do |t|
      t.references :survey, null: false, foreign_key: true
      t.string :question_type, null: false
      t.text :prompt, null: false
      t.jsonb :options, null: false, default: []
      t.boolean :required, null: false, default: false
      t.integer :position, null: false, default: 0
      t.timestamps
    end

    add_index :questions, [:survey_id, :position]
  end
end
