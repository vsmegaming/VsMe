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
    user_one = User.find(game_one.user_id)
    user_two = User.find(game_two.user_id)

    if game_one.score < game_two.score
      last_result.winning_user_id = game_two.user_id
      last_result.save
      user_one.credits -= 5
      user_one.save
      user_two.credits += 5
      user_two.save
    elsif game_one.score > game_two.score
      last_result.winning_user_id = game_one.user_id
      last_result.save
      user_one.credits += 5
      user_one.save
      user_two.credits -= 5
      user_two.save
    else
      last_result.winning_user_id = -1
      last_result.save
    end
  end

end

