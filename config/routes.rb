Vsme::Application.routes.draw do
  devise_for :users

  root 'dashboard#show'

  resource :games

end
