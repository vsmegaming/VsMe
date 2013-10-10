class CreatesResults

  attr_reader :game_one_id,
              :game_two_id,
              :last_result

  def self.with game
    CreatesResults.new game
  end

  def initialize game
    @game = game
    last_result = Result.last

    if last_result && last_result.game_two_id == nil
      last_result.game_two_id = @game.id
      last_result.save
      @game.result_id = last_result.id
      @game.save
      DeterminesWinner.with()
    else
      new_result = Result.create(game_one_id: @game.id)
      @game.result_id = new_result.id
      @game.save
    end

  end

end

