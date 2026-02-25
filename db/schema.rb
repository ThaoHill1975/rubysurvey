# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_02_25_210004) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "admin_users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "questions", force: :cascade do |t|
    t.bigint "survey_id", null: false
    t.string "question_type", null: false
    t.text "prompt", null: false
    t.jsonb "options", default: [], null: false
    t.boolean "required", default: false, null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["survey_id", "position"], name: "index_questions_on_survey_id_and_position"
    t.index ["survey_id"], name: "index_questions_on_survey_id"
  end

  create_table "survey_responses", force: :cascade do |t|
    t.bigint "survey_review_id", null: false
    t.bigint "question_id", null: false
    t.text "answer"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "index_survey_responses_on_question_id"
    t.index ["survey_review_id", "question_id"], name: "index_survey_responses_on_survey_review_id_and_question_id", unique: true
    t.index ["survey_review_id"], name: "index_survey_responses_on_survey_review_id"
  end

  create_table "survey_reviews", force: :cascade do |t|
    t.bigint "survey_id", null: false
    t.string "review_id", null: false
    t.string "contract_id"
    t.string "contract_vehicle_id"
    t.string "reviewer_organization_id"
    t.jsonb "metadata", default: {}, null: false
    t.string "token", null: false
    t.string "status", default: "pending", null: false
    t.boolean "email_sent", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["review_id"], name: "index_survey_reviews_on_review_id", unique: true
    t.index ["status"], name: "index_survey_reviews_on_status"
    t.index ["survey_id"], name: "index_survey_reviews_on_survey_id"
    t.index ["token"], name: "index_survey_reviews_on_token", unique: true
  end

  create_table "surveys", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.string "status", default: "draft", null: false
    t.jsonb "criteria", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["status"], name: "index_surveys_on_status"
  end

  add_foreign_key "questions", "surveys"
  add_foreign_key "survey_responses", "questions"
  add_foreign_key "survey_responses", "survey_reviews"
  add_foreign_key "survey_reviews", "surveys"
end
