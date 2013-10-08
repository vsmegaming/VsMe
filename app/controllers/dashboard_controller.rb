class DashboardController < ApplicationController

  def show
    @games = current_user.games
  end

end
