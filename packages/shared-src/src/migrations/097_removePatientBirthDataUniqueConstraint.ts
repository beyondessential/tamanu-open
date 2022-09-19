import { QueryInterface } from 'sequelize';

export async function up(query: QueryInterface): Promise<void> {
  await query.sequelize.query(`
    ALTER TABLE patient_birth_data DROP CONSTRAINT patient_birth_data_patient_id_key;
  `);
}

export async function down(query: QueryInterface): Promise<void> {
  await query.sequelize.query(`
    ALTER TABLE patient_birth_data ADD CONSTRAINT patient_birth_data_patient_id_key UNIQUE (patient_id);
  `);
}
