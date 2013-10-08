class DeterminesWinner

  attr_reader :game_one_id,
              :game_two_id,
              :game_one,
              :game_two,
              :last_result

  def self.with
    DeterminesWinner.new
  end

  def initialize
    puts "called determines winner"
    last_result = Result.last
    game_one_id = last_result.game_one_id
    game_two_id = last_result.game_two_id
    game_one = Game.find(game_one_id)
    game_two = Game.find(game_two_id)

    if game_one.score >> game_two.score
      last_result.winning_user_id = game_one.user_id
      last_result.save
    else
      last_result.winning_user_id = game_two.user_id
      last_result.save
    end
  end

end

