class GamesController < ApplicationController

  def index
    @games = current_user.games.decorate
  end

  def new
    @game = Game.new
  end

  def create
    @game = Game.new(game_attrs)
    @game.user_id = current_user.id
    @game.credits_wagered = 5

    if @game.save
      CreatesResults.with(@game)
      redirect_to games_path
    else
      render :new
    end
  end

  def leader
    @leaders = User.all.sort { |a,b| b.wins <=> a.wins }
  end

  private

  def game_attrs
    params.require(:game).permit(:score)
  end

end
