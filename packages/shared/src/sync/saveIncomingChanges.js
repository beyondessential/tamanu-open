import config from 'config';

import { sleepAsync } from '@tamanu/shared/utils/sleepAsync';

import { sortInDependencyOrder } from '../models/sortInDependencyOrder';
import { log } from '../services/logging/log';
import { findSyncSnapshotRecords } from './findSyncSnapshotRecords';
import { countSyncSnapshotRecords } from './countSyncSnapshotRecords';
import { SYNC_SESSION_DIRECTION } from './constants';
import { saveCreates, saveDeletes, saveRestores, saveUpdates } from './saveChanges';

const { persistedCacheBatchSize, pauseBetweenPersistedCacheBatchesInMilliseconds } = config.sync;

export const saveChangesForModel = async (model, changes, isCentralServer) => {
  const sanitizeData = d =>
    isCentralServer ? model.sanitizeForCentralServer(d) : model.sanitizeForFacilityServer(d);

  // split changes into create, update, delete
  const incomingRecords = changes.filter(c => c.data.id).map(c => c.data);
  const idsForIncomingRecords = incomingRecords.map(r => r.id);
  // add all records that already exist in the db to the list to be updated
  // even if they are being deleted or restored, we should also run an update query to keep the data in sync
  const existingRecords = (await model.findByIds(idsForIncomingRecords, false)).map(r =>
    r.get({ plain: true }),
  );
  const idToExistingRecord = Object.fromEntries(existingRecords.map(e => [e.id, e]));
  // follow the same pattern for incoming records
  // https://github.com/beyondessential/tamanu/pull/4854#discussion_r1403828225
  const idToIncomingRecord = Object.fromEntries(
    changes.filter(c => c.data.id).map(e => [e.data.id, e]),
  );
  const idsForUpdate = new Set();
  const idsForRestore = new Set();
  const idsForDelete = new Set();

  existingRecords.forEach(existing => {
    // compares incoming and existing records by id
    const incoming = idToIncomingRecord[existing.id];
    idsForUpdate.add(existing.id);

    // Restores only originate from central server
    if (isCentralServer === false && existing.deletedAt && !incoming.isDeleted) {
      idsForRestore.add(existing.id);
    }
    if (!existing.deletedAt && incoming.isDeleted) {
      idsForDelete.add(existing.id);
    }
    if (existing.deletedAt && incoming.isDeleted) {
      // don't do anything related to deletion if incoming record
      // is deleted and existing record is already deleted
    }
  });
  const recordsForCreate = changes
    .filter(c => idToExistingRecord[c.data.id] === undefined)
    .map(({ data, isDeleted }) => {
      // validateRecord(data, null); TODO add in validation
      // pass in 'isDeleted' to be able to create new records even if they are soft deleted.
      return { ...sanitizeData(data), isDeleted };
    });
  const recordsForUpdate = changes
    .filter(r => idsForUpdate.has(r.data.id))
    .map(({ data }) => {
      // validateRecord(data, null); TODO add in validation
      return sanitizeData(data);
    });
  const recordsForRestore = changes
    .filter(r => idsForRestore.has(r.data.id))
    .map(({ data }) => {
      // validateRecord(data, null); TODO add in validation
      return sanitizeData(data);
    });
  const recordsForDelete = changes
    .filter(r => idsForDelete.has(r.data.id))
    .map(({ data }) => {
      // validateRecord(data, null); TODO add in validation
      return sanitizeData(data);
    });

  // run each import process
  log.debug(`saveIncomingChanges: Creating ${recordsForCreate.length} new records`);
  if (recordsForCreate.length > 0) {
    await saveCreates(model, recordsForCreate);
  }
  log.debug(`saveIncomingChanges: Updating ${recordsForUpdate.length} existing records`);
  if (recordsForUpdate.length > 0) {
    await saveUpdates(model, recordsForUpdate, idToExistingRecord, isCentralServer);
  }
  log.debug(`saveIncomingChanges: Soft deleting ${recordsForDelete.length} old records`);
  if (recordsForDelete.length > 0) {
    await saveDeletes(model, recordsForDelete);
  }
  log.debug(`saveIncomingChanges: Restoring ${recordsForRestore.length} deleted records`);
  if (recordsForRestore.length > 0) {
    await saveRestores(model, recordsForRestore);
  }
};

const saveChangesForModelInBatches = async (
  model,
  sequelize,
  sessionId,
  recordType,
  isCentralServer,
) => {
  const syncRecordsCount = await countSyncSnapshotRecords(
    sequelize,
    sessionId,
    SYNC_SESSION_DIRECTION.INCOMING,
    model.tableName,
  );
  log.debug(`saveIncomingChanges: Saving ${syncRecordsCount} changes for ${model.tableName}`);

  const batchCount = Math.ceil(syncRecordsCount / persistedCacheBatchSize);
  let fromId;

  for (let batchIndex = 0; batchIndex < batchCount; batchIndex++) {
    const batchRecords = await findSyncSnapshotRecords(
      sequelize,
      sessionId,
      SYNC_SESSION_DIRECTION.INCOMING,
      fromId,
      persistedCacheBatchSize,
      recordType,
    );
    fromId = batchRecords[batchRecords.length - 1].id;

    try {
      log.info('Sync: Persisting cache to table', {
        table: model.tableName,
        count: batchRecords.length,
      });

      await saveChangesForModel(model, batchRecords, isCentralServer);

      await sleepAsync(pauseBetweenPersistedCacheBatchesInMilliseconds);
    } catch (error) {
      log.error(`Failed to save changes for ${model.name}`);
      throw error;
    }
  }
};

export const saveIncomingChanges = async (
  sequelize,
  pulledModels,
  sessionId,
  isCentralServer = false,
) => {
  const sortedModels = sortInDependencyOrder(pulledModels);

  for (const model of sortedModels) {
    await saveChangesForModelInBatches(
      model,
      sequelize,
      sessionId,
      model.tableName,
      isCentralServer,
    );
  }
};
