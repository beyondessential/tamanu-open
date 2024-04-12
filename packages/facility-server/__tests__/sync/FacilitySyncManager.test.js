/* eslint-disable global-require */
import { inspect } from 'util';

import { sleepAsync } from '@tamanu/shared/utils/sleepAsync';
import { FacilitySyncManager } from '../../dist/sync/FacilitySyncManager';
import { createTestContext } from '../utilities';

describe('FacilitySyncManager', () => {
  let ctx;
  let models;
  const TEST_SESSION_ID = 'sync123';

  beforeAll(async () => {
    ctx = await createTestContext();
    models = ctx.models;
  });

  afterAll(() => ctx.close());

  describe('triggerSync', () => {
    afterEach(() => {
      FacilitySyncManager.restoreConfig();
    });

    it('does nothing if sync is disabled', async () => {
      FacilitySyncManager.overrideConfig({ sync: { enabled: false } });
      const syncManager = new FacilitySyncManager({
        models: {},
        sequelize: {},
        centralServer: {},
      });

      await syncManager.triggerSync();

      expect(syncManager.syncPromise).toBe(null);
    });

    it('awaits the existing sync if one is ongoing', async () => {
      FacilitySyncManager.overrideConfig({ sync: { enabled: true } });
      const syncManager = new FacilitySyncManager({
        models: {},
        sequelize: {},
        centralServer: {},
      });

      const resolveWhenNonEmpty = [];
      syncManager.syncPromise = jest.fn().mockImplementation(async () => {
        while (resolveWhenNonEmpty.length === 0) {
          await sleepAsync(5);
        }
      });

      const promise = syncManager.triggerSync();
      expect(inspect(promise)).toMatch(/pending/);
      resolveWhenNonEmpty.push(true);
      await promise;
    });
  });

  describe('runSync', () => {
    it('clears all snapshot tables before running', async () => {
      const dropSchema = jest.fn();
      const createSchema = jest.fn();

      const syncManager = new FacilitySyncManager({
        models,
        sequelize: {
          getQueryInterface: () => ({
            dropSchema,
            createSchema,
          }),
          query: () => true,
        },
        centralServer: {
          startSyncSession: () => ({ sessionId: TEST_SESSION_ID, tick: 1 }),
          endSyncSession: jest.fn(),
        },
      });

      jest.spyOn(syncManager, 'pullChanges').mockImplementation(() => true);
      jest.spyOn(syncManager, 'pushChanges').mockImplementation(() => true);

      await syncManager.runSync();

      expect(dropSchema).toBeCalledTimes(1);
      expect(dropSchema).toBeCalledWith('sync_snapshots');
      expect(createSchema).toBeCalledTimes(1);
      expect(createSchema).toBeCalledWith('sync_snapshots', {});
    });
  });

  describe('pushChanges', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it("snapshots outgoing changes with the current 'lastSuccessfulSyncPush'", async () => {
      await ctx.models.LocalSystemFact.set('lastSuccessfulSyncPush', '10');

      jest.doMock('../../dist/sync/snapshotOutgoingChanges', () => ({
        snapshotOutgoingChanges: jest.fn().mockImplementation(() => []),
      }));

      // Have to load test function within test scope so that we can mock dependencies per test case
      const {
        FacilitySyncManager: TestFacilitySyncManager,
      } = require('../../dist/sync/FacilitySyncManager');
      const { snapshotOutgoingChanges } = require('../../dist/sync/snapshotOutgoingChanges');

      const syncManager = new TestFacilitySyncManager({
        models,
        sequelize: ctx.sequelize,
        centralServer: {
          startSyncSession: () => ({ sessionId: TEST_SESSION_ID, tick: 1 }),
          endSyncSession: jest.fn(),
          push: jest.fn(),
        },
      });

      await syncManager.pushChanges(TEST_SESSION_ID, 10);

      expect(snapshotOutgoingChanges).toBeCalledTimes(1);
      expect(snapshotOutgoingChanges).toBeCalledWith(ctx.sequelize, expect.any(Object), '10');
    });

    it('pushes outgoing changes with current sessionId', async () => {
      const outgoingChanges = [{ test: 'test' }];
      await ctx.models.LocalSystemFact.set('currentSyncTick', '10');

      jest.doMock('../../dist/sync/snapshotOutgoingChanges', () => ({
        ...jest.requireActual('../../dist/sync/snapshotOutgoingChanges'),
        snapshotOutgoingChanges: jest.fn().mockImplementation(() => outgoingChanges),
      }));
      jest.doMock('../../dist/sync/pushOutgoingChanges', () => ({
        ...jest.requireActual('../../dist/sync/pushOutgoingChanges'),
        pushOutgoingChanges: jest.fn().mockImplementation(() => true),
      }));

      // Have to load test function within test scope so that we can mock dependencies per test case
      const {
        FacilitySyncManager: TestFacilitySyncManager,
      } = require('../../dist/sync/FacilitySyncManager');
      const { pushOutgoingChanges } = require('../../dist/sync/pushOutgoingChanges');

      const syncManager = new TestFacilitySyncManager({
        models,
        sequelize: ctx.sequelize,
        centralServer: {
          startSyncSession: () => ({ sessionId: TEST_SESSION_ID, tick: 1 }),
          endSyncSession: jest.fn(),
          push: jest.fn(),
        },
      });

      await syncManager.pushChanges(TEST_SESSION_ID, 1);

      expect(pushOutgoingChanges).toBeCalledTimes(1);
      expect(pushOutgoingChanges).toBeCalledWith(
        syncManager.centralServer,
        TEST_SESSION_ID,
        outgoingChanges,
      );
    });
  });

  describe('pullChanges', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it("pull changes with current 'lastSuccessfulSyncPull'", async () => {
      await ctx.models.LocalSystemFact.set('lastSuccessfulSyncPull', '10');

      jest.doMock('@tamanu/shared/sync', () => ({
        ...jest.requireActual('@tamanu/shared/sync'),
        createSnapshotTable: jest.fn(),
      }));
      jest.doMock('../../dist/sync/pullIncomingChanges', () => ({
        ...jest.requireActual('../../dist/sync/pullIncomingChanges'),
        pullIncomingChanges: jest.fn().mockImplementation(() => []),
      }));
      jest.doMock('../../dist/sync/assertIfPulledRecordsUpdatedAfterPushSnapshot', () => ({
        ...jest.requireActual('../../dist/sync/assertIfPulledRecordsUpdatedAfterPushSnapshot'),
        assertIfPulledRecordsUpdatedAfterPushSnapshot: jest.fn(),
      }));

      // Have to load test function within test scope so that we can mock dependencies per test case
      const {
        FacilitySyncManager: TestFacilitySyncManager,
      } = require('../../dist/sync/FacilitySyncManager');
      const { createSnapshotTable } = require('@tamanu/shared/sync');

      const syncManager = new TestFacilitySyncManager({
        models,
        sequelize: ctx.sequelize,
        centralServer: {
          startSyncSession: () => ({ sessionId: TEST_SESSION_ID, tick: 1 }),
          endSyncSession: jest.fn(),
          push: jest.fn(),
        },
      });

      await syncManager.pullChanges(TEST_SESSION_ID);

      expect(createSnapshotTable).toBeCalledTimes(1);
      expect(createSnapshotTable).toBeCalledWith(ctx.sequelize, TEST_SESSION_ID);
    });

    it('save changes with current sessionId', async () => {
      await ctx.models.LocalSystemFact.set('currentSyncTick', '10');

      jest.doMock('@tamanu/shared/sync', () => ({
        ...jest.requireActual('@tamanu/shared/sync'),
        createSnapshotTable: jest.fn(),
        saveIncomingChanges: jest.fn(),
      }));
      jest.doMock('../../dist/sync/pullIncomingChanges', () => ({
        ...jest.requireActual('../../dist/sync/pullIncomingChanges'),
        pullIncomingChanges: jest.fn().mockImplementation(() => ({ totalPulled: 3, tick: 1 })),
      }));
      jest.doMock('../../dist/sync/assertIfPulledRecordsUpdatedAfterPushSnapshot', () => ({
        ...jest.requireActual('../../dist/sync/assertIfPulledRecordsUpdatedAfterPushSnapshot'),
        assertIfPulledRecordsUpdatedAfterPushSnapshot: jest.fn(),
      }));

      // Have to load test function within test scope so that we can mock dependencies per test case
      const {
        FacilitySyncManager: TestFacilitySyncManager,
      } = require('../../dist/sync/FacilitySyncManager');
      const { saveIncomingChanges } = require('@tamanu/shared/sync');

      const syncManager = new TestFacilitySyncManager({
        models,
        sequelize: ctx.sequelize,
        centralServer: {
          startSyncSession: () => ({ sessionId: TEST_SESSION_ID, tick: 1 }),
          endSyncSession: jest.fn(),
          push: jest.fn(),
        },
      });

      await syncManager.pullChanges(TEST_SESSION_ID);

      expect(saveIncomingChanges).toBeCalledTimes(1);
      expect(saveIncomingChanges).toBeCalledWith(
        ctx.sequelize,
        expect.any(Object),
        TEST_SESSION_ID,
      );
    });
  });
});
