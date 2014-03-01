Vsme::Application.routes.draw do
  devise_for :users

  root 'games#leader'

  resources :games do
    get :leader
  end

  get "high_scores" => "games#scorer"

end
