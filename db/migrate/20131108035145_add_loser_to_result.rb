class AddLoserToResult < ActiveRecord::Migration
  def change
    add_column :results, :losing_user_id, :integer
  end
end
