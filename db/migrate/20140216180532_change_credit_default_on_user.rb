class ChangeCreditDefaultOnUser < ActiveRecord::Migration
  def change
    change_column :users, :credits, :integer, default: 50
  end
end
