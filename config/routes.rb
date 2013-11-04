Vsme::Application.routes.draw do
  devise_for :users

  root 'games#index'

  resource :games

end
