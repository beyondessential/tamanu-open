import config from 'config';
import { log } from 'shared/services/logging';
import { WebRemote } from '../sync';

export async function performDatabaseIntegrityChecks(context) {
  // run in a transaction so any errors roll back all changes
  await context.sequelize.transaction(async () => {
    await ensureHostMatches(context);
    await ensureFacilityMatches(context);
  });
}

/*
 * ensureHostMatches
 */
async function ensureHostMatches(context) {
  const { LocalSystemFact } = context.models;
  const remote = new WebRemote(context);
  const configuredHost = remote.host;
  const lastHost = await LocalSystemFact.get('syncHost');

  if (!lastHost) {
    await LocalSystemFact.set('syncHost', remote.host);
    return;
  }

  if (lastHost !== configuredHost) {
    throw new Error(
      `integrity check failed: sync.host mismatch: read ${configuredHost} from config, but already connected to ${lastHost} (you may need to drop and recreate the database, change the config back, or if you're 100% sure, remove the "syncHost" key from the "local_system_fact" table)`,
    );
  }
}

/*
 * ensureFacilityMatches
 */
async function ensureFacilityMatches(context) {
  const { LocalSystemFact } = context.models;
  const configuredFacility = config.serverFacilityId;
  const lastFacility = await LocalSystemFact.get('facilityId');

  if (!lastFacility) {
    if (config.sync.enabled) {
      // if sync is enabled and there's no facility set, perform the initial check
      await performInitialIntegritySetup(context);
    } else {
      // if sync is disabled and there's no facility set, don't do anything
      // this allows a newly-created lan server with sync disabled to import data for the first time
    }
    return;
  }

  if (lastFacility !== configuredFacility) {
    // if the facility doesn't match, error
    throw new Error(
      `integrity check failed: serverFacilityId mismatch: read ${configuredFacility} from config, but already registered as ${lastFacility} (you may need to drop and recreate the database, change the config back, or if you're 100% sure, remove the "facilityId" key from the "local_system_fact" table)`,
    );
  }
}

async function performInitialIntegritySetup(context) {
  const remote = new WebRemote(context);
  log.info(`Verifying sync connection to ${remote.host}...`);

  const { token, facility } = await remote.connect();

  if (!token) {
    throw new Error('Could not obtain valid token from sync server.');
  }

  if (!facility) {
    throw new Error(
      `Configured serverFacilityId ${config.serverFacilityId} not recognised by sync server`,
    );
  }

  // We've ensured that our immutable config stuff is valid -- save it!
  const { LocalSystemFact } = context.models;
  await LocalSystemFact.set('facilityId', facility.id);

  log.info(`Verified with sync server as ${facility.name}`);
}