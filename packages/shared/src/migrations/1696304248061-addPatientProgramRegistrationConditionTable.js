import Sequelize, { DataTypes } from 'sequelize';

export async function up(query) {
  await query.createTable('patient_program_registration_conditions', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.fn('uuid_generate_v4'),
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('current_timestamp', 3),
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('current_timestamp', 3),
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    date: {
      type: DataTypes.DATETIMESTRING,
      allowNull: false,
    },
    deletion_status: {
      type: Sequelize.TEXT,
    },
    deletion_date: {
      type: DataTypes.DATETIMESTRING,
    },

    patient_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    program_registry_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    program_registry_condition_id: {
      type: Sequelize.STRING,
    },
    clinician_id: {
      type: Sequelize.STRING,
    },
    deletion_clinician_id: {
      type: Sequelize.STRING,
    },
  });
}

export async function down(query) {
  await query.dropTable('patient_program_registration_conditions');
}
