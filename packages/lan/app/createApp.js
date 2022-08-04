import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';

import { SERVER_TYPES } from 'shared/constants';
import { getLoggingMiddleware } from 'shared/services/logging';

import routes from './routes';
import errorHandler from './middleware/errorHandler';
import { versionCompatibility } from './middleware/versionCompatibility';

import { version } from './serverInfo';

export function createApp({ sequelize, models, syncManager }) {
  // Init our app
  const app = express();
  app.use(compression());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    res.setHeader('X-Tamanu-Server', SERVER_TYPES.LAN);
    res.setHeader('X-Version', version);
    next();
  });

  app.use(getLoggingMiddleware());

  app.use((req, res, next) => {
    req.models = models;
    req.db = sequelize;
    req.syncManager = syncManager;

    next();
  });

  app.use(versionCompatibility);

  // index route for debugging connectivity
  app.get('/$', (req, res) => {
    res.send({
      index: true,
    });
  });

  app.use('/', routes);

  // Dis-allow all other routes
  app.get('*', (req, res) => {
    res.status(404).end();
  });

  app.use(errorHandler);

  return app;
}
