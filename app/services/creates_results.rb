class CreatesResults

  attr_reader :game_one_id,
              :game_two_id,
              :winning_user_id
              :last_result

  def self.with game_id
    CreatesResults.new game_id
  end

  def initialize game_id
    @game_id = game_id
    last_result = Result.last

    if last_result.game_two_id == nil
      puts "Game two = nil"
      last_result.game_two_id = @game_id
      last_result.save
    else
      puts "New Result"
      Result.create(game_one_id: @game_id)
    end

  end

end

