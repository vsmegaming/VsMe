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
        User.find(game.result.losing_user_id).email
      else
        "x"
      end
    elsif game.result.winning_user_id == nil
      "-"
    elsif game.result.winning_user_id == -1
      "-"
    else
      User.find(game.result.winning_user_id).email
    end
  end

end
