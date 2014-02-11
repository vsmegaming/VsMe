class CreateResults < ActiveRecord::Migration
  def change
    create_table :results do |t|
      t.integer :game_one_id
      t.integer :game_two_id
      t.integer :winning_user_id

      t.timestamps
    end
  end
end
