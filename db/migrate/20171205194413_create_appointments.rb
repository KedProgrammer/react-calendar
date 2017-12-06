class CreateAppointments < ActiveRecord::Migration[5.1]
  def change
    create_table :appointments do |t|
      t.datetime :appt_time
      t.string :title

      t.timestamps
    end
  end
end
