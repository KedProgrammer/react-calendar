Rails.application.routes.draw do
  root 'appointments#index'
  resources :appointments
  get '/appointments/:id/edit', to: "appointments#edit"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
