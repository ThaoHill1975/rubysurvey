class CreateSurveys < ActiveRecord::Migration[7.1]
  def change
    create_table :surveys do |t|
      t.string :title, null: false
      t.text :description
      t.string :status, null: false, default: "draft"
      t.jsonb :criteria, null: false, default: {}
      t.timestamps
    end

    add_index :surveys, :status
  end
end
