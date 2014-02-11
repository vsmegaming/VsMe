class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.integer :user_id
      t.integer :credits_wagered
      t.integer :score

      t.timestamps
    end
  end
end
