class GamesController < ApplicationController
  respond_to :html

  def new
    @game = Game.new
  end

  def create
    @game = Game.new(game_attrs)
    @game.user_id = current_user.id
    @game.credits_wagered = 5

    CreatesResults.with(@game)
    respond_with(@game, location: root_path)

  end

  private

  def game_attrs
    params.require(:game).permit(:score)
  end

end
