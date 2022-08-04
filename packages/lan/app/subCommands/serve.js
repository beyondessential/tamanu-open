import config from 'config';
import { Command } from 'commander';

import { log } from 'shared/services/logging';

import { checkConfig } from '../checkConfig';
import { initDatabase, performDatabaseIntegrityChecks } from '../database';
import { addPatientMarkForSyncHook, SyncManager, WebRemote } from '../sync';
import { createApp } from '../createApp';
import { startScheduledTasks } from '../tasks';
import { listenForServerQueries } from '../discovery';

import { version } from '../serverInfo';

async function serve({ skipMigrationCheck }) {
  log.info(`Starting facility server version ${version}`, {
    serverFacilityId: config.serverFacilityId,
  });

  log.info(`Process info`, {
    execArgs: process.execArgs || '<empty>',
  });

  const context = await initDatabase();
  if (config.db.sqlitePath || config.db.migrateOnStartup) {
    await context.sequelize.migrate('up');
  } else {
    await context.sequelize.assertUpToDate({ skipMigrationCheck });
  }

  await checkConfig(config, context);
  await performDatabaseIntegrityChecks(context);

  context.remote = new WebRemote(context);
  context.remote.connect(); // preemptively connect remote to speed up sync
  context.syncManager = new SyncManager(context);

  const app = createApp(context);

  const { port } = config;
  const server = app.listen(port, () => {
    log.info(`Server is running on port ${port}!`);
  });
  process.on('SIGTERM', () => {
    log.info('Received SIGTERM, closing HTTP server');
    server.close();
  });

  listenForServerQueries();

  startScheduledTasks(context);

  addPatientMarkForSyncHook(context);
}

export const serveCommand = new Command('serve')
  .description('Start the Tamanu lan server')
  .option('--skipMigrationCheck', 'skip the migration check on startup')
  .action(serve);
