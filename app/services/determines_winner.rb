class DeterminesWinner

  attr_reader :game_one,
              :game_two,
              :last_result

  def self.with last_result
    DeterminesWinner.new last_result
  end

  def initialize last_result
    last_result = last_result
    game_one = Game.find(last_result.game_one_id)
    game_two = Game.find(last_result.game_two_id)

    if game_one.score < game_two.score
      last_result.winning_user_id = game_two.user_id
      last_result.save
    elsif game_one.score > game_two.score
      last_result.winning_user_id = game_one.user_id
      last_result.save
    else
      last_result.winning_user_id = -1
      last_result.save
    end
  end

end

