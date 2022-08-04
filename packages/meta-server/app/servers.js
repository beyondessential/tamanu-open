import express from 'express';
import asyncHandler from 'express-async-handler';

import { SERVER_TYPES } from 'shared/constants';
import { log } from 'shared/services/logging';
import { fetchWithTimeout } from 'shared/utils/fetchWithTimeout';

import { makeTableResponse } from './render/table';
import { getUrl, getBool, getMilliseconds } from './render/cell';

export const serversRouter = express.Router();

// Note: Order here matters - it'll be the order they're displayed
// Servers are ordered first by type, then alphabetically.
const servers = [
  // live servers
  { name: 'Aspen Medical Fiji', type: 'live', host: 'https://syncba.aspenmedical.com.fj' },
  { name: 'Fiji', type: 'live', host: 'https://sync.tamanu-fiji.org' },
  { name: 'Fiji MDA', type: 'live', host: 'https://sync-mda.tamanu-fiji.org' },
  { name: 'Fiji NCD', type: 'live', host: 'https://sync-ncd-pilot.tamanu-fiji.org' },
  { name: 'Fiji Tourism', type: 'live', host: 'https://sync-tourism.tamanu-fiji.org' },
  { name: 'Kiribati', type: 'live', host: 'https://sync.tamanu-kiribati.org' },
  {
    name: 'Motivation Australia - Papua New Guinea',
    type: 'live',
    host: 'https://motivation-sync-png.tamanu.io',
  },
  { name: 'Nauru', type: 'live', host: 'https://sync.tamanu-nauru.org' },
  { name: 'Palau', type: 'live', host: 'https://sync.tamanu-palau.org' },
  { name: 'Samoa', type: 'live', host: 'https://tamanu-sync.health.gov.ws' },
  { name: 'Tuvalu', type: 'live', host: 'https://sync.tamanu-tuvalu.org' },

  // demo servers
  { name: 'Demo', type: 'demo', host: 'https://sync-demo.tamanu.io' },
  { name: 'Demo (Aspen)', type: 'demo', host: 'https://aspen-demo-sync.tamanu-fiji.org' },
  { name: 'Demo (Fiji)', type: 'demo', host: 'https://sync-demo.tamanu-fiji.org' },
  { name: 'Demo (Fiji Tourism)', type: 'demo', host: 'https://sync.demo-tourism.tamanu-fiji.org' },
  { name: 'Demo (Kiribati)', type: 'demo', host: 'https://sync-demo.tamanu-kiribati.org' },
  { name: 'Demo (Nauru)', type: 'demo', host: 'https://sync-demo-nauru.tamanu.io' },
  { name: 'Demo (Palau)', type: 'demo', host: 'https://sync-demo-palau.tamanu.io' },
  { name: 'Demo (Samoa)', type: 'demo', host: 'https://sync-samoa-demo.tamanu.io' },
  { name: 'Demo (Tuvalu)', type: 'demo', host: 'https://sync-demo-tuvalu.tamanu.io' },

  // development servers
  { name: 'Dev', type: 'dev', host: 'https://sync-dev.tamanu.io' },
  { name: 'Fiji VPS/VRS UAT', type: 'dev', host: 'https://sync-uat-fiji-vps.tamanu.io' },
  { name: 'Staging', type: 'dev', host: 'https://sync-staging.tamanu.io' },
  { name: 'Stress testing', type: 'dev', host: 'https://sync-stress-test.tamanu.io' },
];

serversRouter.get('/', (req, res) => {
  res.send(servers);
});

serversRouter.get('/readable', (req, res) => {
  res.send(
    makeTableResponse(
      [{ key: 'name' }, { key: 'type' }, { key: 'host', getter: getUrl }],
      servers,
      { title: 'Server index' },
    ),
  );
});

const getStatuses = () => {
  const STATUS_CHECK_TIMEOUT_MS = 10 * 1000;
  const EXPECTED_SERVER_TYPE = SERVER_TYPES.SYNC;

  return Promise.all(
    servers.map(async ({ name, host, type }) => {
      const status = { name, host, type };
      try {
        // collect results
        const startTime = Date.now();
        const result = await fetchWithTimeout(host, { timeout: STATUS_CHECK_TIMEOUT_MS });
        const latency = Date.now() - startTime;

        // perform checks
        const jsonResult = await result.json();
        if (jsonResult.index !== true) {
          throw new Error(
            `Expected body to include '{"index":true}' but got ${await result.blob()}`,
          );
        }

        // TODO: remove deprecated X-Runtime check once all servers have moved on
        const serverType = result.headers.get('X-Tamanu-Server') || result.headers.get('X-Runtime');
        if (serverType !== EXPECTED_SERVER_TYPE) {
          throw new Error(
            `Expected X-Tamanu-Server header to be '${EXPECTED_SERVER_TYPE}' but got ${serverType}`,
          );
        }

        // compile status
        status.success = true;
        status.latency = latency;
        status.version = result.headers.get('X-Version');
      } catch (e) {
        log.warn(`getStatuses() failed: ${e.stack}`);
        status.success = false;
        status.error = e.toString();
      }
      return status;
    }),
  );
};

serversRouter.get(
  '/status',
  asyncHandler(async (req, res) => {
    res.send(await getStatuses());
  }),
);

serversRouter.get(
  '/status/readable',
  asyncHandler(async (req, res) => {
    res.send(
      makeTableResponse(
        [
          { key: 'name' },
          { key: 'success', getter: getBool },
          { key: 'version' },
          { key: 'type' },
          { key: 'host', getter: getUrl },
          { key: 'latency', getter: getMilliseconds },
          { key: 'error' },
        ],
        await getStatuses(),
        { title: 'Server statuses' },
      ),
    );
  }),
);
