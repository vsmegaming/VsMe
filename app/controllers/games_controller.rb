class GamesController < ApplicationController

  def new
    @game = Game.new
  end

  def create
    @game = Game.new(game_attrs)
    @game.user_id = current_user.id
    @game.credits_wagered = 5

    if @game.save
      redirect_to root_path
    else
      render :new
    end
  end

  private

  def game_attrs
    params.require(:game).permit(:score)
  end

end
