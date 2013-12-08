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

end
