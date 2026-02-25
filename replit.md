# Procurated Survey App

## Overview
A standalone survey application for the Procurated platform. Built with Rails 7 backend and Vite + React + TypeScript frontend.

## Architecture
- **Backend**: Ruby on Rails 7.1 with PostgreSQL
- **Frontend**: Vite + React + TypeScript with SCSS
- **Auth**: Devise for admin authentication
- **Background Jobs**: Sidekiq + Redis (configured, pending Redis setup)
- **API**: Versioned under `/api/v1/`

## Key Components

### Models
- `AdminUser` - Devise-authenticated admin users
- `Survey` - Survey definitions with title, description, status (draft/published/archived), criteria
- `Question` - Survey questions (free_form, rating, multiple_choice) with position ordering
- `SurveyReview` - Links incoming reviews to surveys, tracks completion status, holds unique token
- `SurveyResponse` - Individual question answers for a survey review

### API Endpoints
- `POST /api/v1/reviews` - Idempotent endpoint for review published events, determines survey eligibility
- `GET/POST /api/v1/survey_completions/:token` - Survey completion flow
- `GET/POST/PATCH/DELETE /api/v1/surveys` - Admin CRUD (session-authenticated)
- `GET /api/v1/surveys/stats` - Dashboard statistics

### Frontend Entrypoints
- `app/frontend/entrypoints/admin.tsx` - Admin area (authenticated)
- `app/frontend/entrypoints/survey.tsx` - Survey completion (unauthenticated)

### Services
- `SurveyEligibilityService` - Determines if a review triggers a survey

### Background Jobs
- `SendSurveyEmailJob` - Sends survey email (placeholder for HubSpot integration)

## Running
- `bash bin/dev` starts Rails (port 5000) + Vite dev server concurrently
- Default admin: admin@example.com / password123

## Testing
- Backend: `bundle exec rspec`
- Test database auto-created from development schema

## Ports
- Rails: 5000
- Vite Dev Server: 3036

## Key Dependencies
- rails ~> 7.1, pg, devise, sidekiq, vite_rails, rack-cors
- react, react-dom, typescript, sass
- Vite uses esbuild's built-in JSX automatic runtime (no @vitejs/plugin-react) to avoid preamble issues with Replit's proxy
