import { getSnapshotTableName, SYNC_SESSION_DIRECTION } from '@tamanu/shared/sync';
import { LAST_SUCCESSFUL_SYNC_PUSH_KEY } from '@tamanu/shared/sync/constants';

/**
 * If a pulled record was also updated between push and pull, it would get overwritten by pullings if we proceed.
 * Throw an error so that the sync restarts and the updated record is not forgotten and pushed to central in the next sync.
 */
const assertModelIfPulledRecordsUpdatedAfterPushSnapshot = async (model, sessionId) => {
  const snapshotTableName = getSnapshotTableName(sessionId);

  const [[{ count }]] = await model.sequelize.query(
    `
      SELECT COUNT(*)::integer as count
      FROM ${snapshotTableName}
      JOIN ${model.tableName} 
        ON ${snapshotTableName}.record_id::text = ${model.tableName}.id::text
        AND ${snapshotTableName}.record_type = $recordType
      WHERE direction = $direction
        AND is_deleted IS FALSE
        AND ${model.tableName}.updated_at_sync_tick > (SELECT value::bigint FROM local_system_facts WHERE key = $lastSuccessfulSyncPushKey);
    `,
    {
      bind: {
        recordType: model.tableName,
        direction: SYNC_SESSION_DIRECTION.INCOMING,
        lastSuccessfulSyncPushKey: LAST_SUCCESSFUL_SYNC_PUSH_KEY,
      },
    },
  );

  if (count) {
    throw new Error(
      `Facility: There are ${count} ${model.tableName} record(s) updated between 'snapshot-for-pushing' and now. Error thrown to restart the sync cycle and push the updated records to central`,
    );
  }
};

export const assertIfPulledRecordsUpdatedAfterPushSnapshot = async (models, sessionId) => {
  for (const model of models) {
    await assertModelIfPulledRecordsUpdatedAfterPushSnapshot(model, sessionId);
  }
};
