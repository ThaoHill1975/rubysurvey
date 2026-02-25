# Procurated Survey App

A standalone survey application built with Ruby on Rails 7 and React + TypeScript. It includes an authenticated admin area for creating/managing surveys and an unauthenticated survey completion area for reviewers.

## Architecture

- **Backend**: Ruby on Rails 7.1, PostgreSQL, Sidekiq + Redis for background jobs
- **Frontend**: Vite + React + TypeScript with SCSS for styling
- **API**: Versioned JSON API (`/api/v1/...`)
- **Auth**: Devise for admin authentication

## Running Locally

### Prerequisites

- Ruby 3.2+
- Node.js 20+
- PostgreSQL
- Redis (for Sidekiq)

### Setup

```bash
bundle install
npm install
bundle exec rails db:create db:migrate db:seed
```

### Start the Application

```bash
bash bin/dev
```

This starts both the Rails server (port 5000) and the Vite dev server concurrently.

### Default Admin Credentials

- Email: `admin@example.com`
- Password: `password123`

## Running Tests

### Backend (RSpec)

```bash
RAILS_ENV=test bundle exec rails db:create db:migrate
bundle exec rspec
```

### Frontend (Jest)

```bash
npx jest --config jest.config.js
```

Test files should be placed under `spec/javascript/components/`.

## Building for Production

```bash
NODE_ENV=production bundle exec vite build
RAILS_ENV=production bundle exec rails assets:precompile
```

## API Reference

### POST /api/v1/reviews

Called when a review is published. Determines survey eligibility and triggers email delivery.

**Request Body:**
```json
{
  "review_id": "review-123",
  "contract_id": "contract-1",
  "contract_vehicle_id": "cv-1",
  "reviewer_organization_id": "org-1",
  "reviewer_name": "John Doe",
  "reviewer_email": "john@example.com",
  "review_title": "Great Service",
  "supplier_name": "Acme Corp",
  "contract_name": "IT Services"
}
```

**Eligible Response (200):**
```json
{
  "survey_eligible": true,
  "survey_review_id": 1
}
```

**Not Eligible Response (422):**
```json
{
  "survey_eligible": false,
  "reason": "no_active_surveys"
}
```

Reason codes: `no_active_surveys`, `no_matching_criteria`, `already_processed`, `invalid_payload`

This endpoint is **idempotent** - repeated calls for the same review will not create duplicate records or emails.

### GET /api/v1/survey_completions/:token

Returns survey questions and review context for a given token.

### POST /api/v1/survey_completions/:token

Submits survey responses.

## Project Structure

```
app/
  controllers/
    admin/              # Admin area controllers
    api/v1/             # Versioned API controllers
  frontend/
    entrypoints/        # Vite entrypoints (admin.tsx, survey.tsx)
    admin/              # Admin React components
    survey/             # Survey completion React components
    ui/                 # Reusable UI components
    lib/                # Shared utilities (api.ts, types.ts)
  models/               # ActiveRecord models
  services/             # Business logic services
  jobs/                 # Sidekiq background jobs
  views/
    admin/              # Admin ERB views (mount React)
    surveys/            # Survey ERB views (mount React)
    layouts/            # Layout templates
spec/
  factories/            # FactoryBot factories
  models/               # Model specs
  requests/             # API request specs
  javascript/
    components/         # Jest test files
```
