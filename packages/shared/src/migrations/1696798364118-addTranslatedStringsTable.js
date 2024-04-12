import Sequelize, { DataTypes } from 'sequelize';

export async function up(query) {
  await query.createTable(
    'translated_strings',
    {
      // For translated_strings, we use a composite primary key of string_id plus language
      id: {
        type: `TEXT GENERATED ALWAYS AS ("string_id" || ';' || "language") STORED`,
      },
      string_id: {
        type: DataTypes.TEXT,
        required: true,
        primaryKey: true,
      },
      language: {
        type: DataTypes.TEXT,
        required: true,
        primaryKey: true,
      },
      text: {
        type: DataTypes.TEXT,
        required: true,
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
    },
    {
      uniqueKeys: {
        string_language_unique: {
          fields: ['string_id', 'language'],
        },
      },
      indexes: [
        {
          name: 'string_id_index',
          fields: ['string_id'],
        },
        {
          name: 'language_index',
          fields: ['language'],
        },
        {
          name: 'updated_at_sync_tick_index',
          fields: ['language', 'updated_at_sync_tick'],
        },
      ],
    },
  );
}

export async function down(query) {
  await query.dropTable('translated_strings');
}
