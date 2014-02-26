class GameDecorator < Draper::Decorator
  delegate_all

  def outcome(current_user)
    if game.result.winning_user_id == current_user.id
      "Winner"
    elsif game.result.winning_user_id == nil
      "-"
    elsif game.result.winning_user_id == -1
      "Tie"
    else
      "Loser"
    end
  end

  def opponent(current_user)
    if game.result.winning_user_id == current_user.id
      if game.result.losing_user_id.present?
        losing_opponent(game.result.losing_user_id)
      else
        "x"
      end
    elsif game.result.winning_user_id == nil
      "-"
    elsif game.result.winning_user_id == -1
      "-"
    else
      winning_opponent(game.result.winning_user_id)
    end
  end

  def losing_opponent(losing_id)
    if User.find(losing_id).user_name
      User.find(losing_id).user_name
    else
      "(no name given)"
    end
  end

  def winning_opponent(winning_id)
    if User.find(winning_id).user_name
      User.find(winning_id).user_name
    else
      "(no name given)"
    end
  end

end
