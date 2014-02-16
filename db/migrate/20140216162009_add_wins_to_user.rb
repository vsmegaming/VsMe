class AddWinsToUser < ActiveRecord::Migration
  def change
    add_column :users, :wins, :integer, default: 0
  end
end
