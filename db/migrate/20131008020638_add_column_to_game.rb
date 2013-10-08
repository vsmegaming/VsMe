class AddColumnToGame < ActiveRecord::Migration
  def change
    add_column :games, :result_id, :integer
  end
end
