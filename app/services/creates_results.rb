class CreatesResults

  attr_reader :game_one_id,
              :game_two_id,
              :last_result

  def self.with game
    CreatesResults.new game
  end

  def initialize game
    @game = game
    
    @user = User.find(@game.user_id)
    if @game.score > @user.high_score
      @user.high_score = @game.score
      @user.save
    end

    @results = Result.all
    last_result = nil

    if @results.any?
      @results.each do |result|
        if result.game_two_id == nil
          last_result = result
          last_result_game = Game.find(last_result.game_one_id)
          if last_result_game.user_id != @game.user_id
            last_result.game_two_id = @game.id
            last_result.save
            @game.result_id = last_result.id
            @game.save
            DeterminesWinner.with(last_result)
            break
          else
            new_result
            break
          end
        end
      end
      if last_result == nil
        new_result
      end
    else
      new_result
    end

  end

  def new_result
    new_result = Result.create(game_one_id: @game.id)
    @game.result_id = new_result.id
    @game.save
  end

end

