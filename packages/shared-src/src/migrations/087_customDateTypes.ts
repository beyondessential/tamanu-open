import { QueryInterface } from 'sequelize';

export async function up(query: QueryInterface) {
  await query.sequelize.query('CREATE DOMAIN date_time_string as CHAR(19)');
  await query.sequelize.query('CREATE DOMAIN date_string as CHAR(10)');
}

export async function down(query: QueryInterface) {
  await query.sequelize.query('DROP DOMAIN date_time_string');
  await query.sequelize.query('DROP DOMAIN date_string');
}
