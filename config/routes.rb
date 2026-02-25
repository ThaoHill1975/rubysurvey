Rails.application.routes.draw do
  devise_for :admin_users, path: "admin", controllers: {
    sessions: "admin/sessions"
  }

  namespace :admin do
    root to: "dashboard#index"
    resources :surveys, only: [:index, :new, :edit, :show]
  end

  namespace :api do
    namespace :v1 do
      resources :reviews, only: [:create]
      resources :surveys, only: [:index, :show, :create, :update, :destroy] do
        collection do
          get :stats
        end
      end
      get "survey_completions/:token", to: "survey_completions#show", as: :survey_completion
      post "survey_completions/:token", to: "survey_completions#create"
    end
  end

  get "s/:token", to: "surveys#show", as: :take_survey
  get "s/:token/complete", to: "surveys#complete", as: :survey_complete

  root to: redirect("/admin")
end
