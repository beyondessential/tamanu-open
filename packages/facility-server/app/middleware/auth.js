import { context, propagation, trace } from '@opentelemetry/api';
import { sign as signCallback, verify as verifyCallback } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import config from 'config';
import { promisify } from 'util';
import crypto from 'crypto';

import { VISIBILITY_STATUSES } from '@tamanu/constants';
import { BadAuthenticationError } from '@tamanu/shared/errors';
import { log } from '@tamanu/shared/services/logging';
import { getPermissionsForRoles } from '@tamanu/shared/permissions/rolesToPermissions';

import { CentralServerConnection } from '../sync';

const { tokenDuration, secret } = config.auth;

// regenerate the secret key whenever the server restarts.
// this will invalidate all current tokens, but they're meant to expire fairly quickly anyway.
const jwtSecretKey = secret || crypto.randomUUID();
const sign = promisify(signCallback);
const verify = promisify(verifyCallback);

export async function getToken(user, expiresIn = tokenDuration) {
  return sign(
    {
      userId: user.id,
    },
    jwtSecretKey,
    { expiresIn },
  );
}

export async function comparePassword(user, password) {
  try {
    const passwordHash = user && user.password;

    // do the password comparison even if the user is invalid so
    // that the login check doesn't reveal whether a user exists or not
    const passwordMatch = await compare(password, passwordHash || 'invalid-hash');

    return user && passwordMatch;
  } catch (e) {
    return false;
  }
}

export async function centralServerLogin(models, email, password, deviceId) {
  // try logging in to central server
  const centralServer = new CentralServerConnection({ deviceId });
  const response = await centralServer.fetch('login', {
    awaitConnection: false,
    retryAuth: false,
    method: 'POST',
    body: {
      email,
      password,
      deviceId,
    },
    backoff: {
      maxAttempts: 1,
    },
  });

  // we've logged in as a valid central user - update local database to match
  const { user, localisation } = response;
  const { id, ...userDetails } = user;

  await models.User.sequelize.transaction(async () => {
    await models.User.upsert({
      id,
      ...userDetails,
      password,
      deletedAt: null,
    });
    await models.UserLocalisationCache.upsert({
      userId: id,
      localisation: JSON.stringify(localisation),
      deletedAt: null,
    });
  });

  return { central: true, user, localisation };
}

async function localLogin(models, email, password) {
  // some other error in communicating with central server, revert to local login
  const user = await models.User.getForAuthByEmail(email);

  const passwordMatch = await comparePassword(user, password);

  if (!passwordMatch) {
    throw new BadAuthenticationError('Incorrect username or password, please try again');
  }

  const localisation = await models.UserLocalisationCache.getLocalisation({
    where: { userId: user.id },
    order: [['createdAt', 'DESC']],
  });

  return { central: false, user, localisation };
}

async function centralServerLoginWithLocalFallback(models, email, password, deviceId) {
  // always log in locally when testing
  if (process.env.NODE_ENV === 'test') {
    return localLogin(models, email, password);
  }

  try {
    return await centralServerLogin(models, email, password, deviceId);
  } catch (e) {
    if (e.name === 'BadAuthenticationError') {
      // actual bad credentials server-side
      throw new BadAuthenticationError('Incorrect username or password, please try again');
    }

    // if it is forbidden error when login to central server,
    // throw the error instead of proceeding to local login
    if (e.centralServerResponse?.status === 403 && e.centralServerResponse?.body?.error) {
      throw e.centralServerResponse.body.error;
    }

    log.warn(`centralServerLoginWithLocalFallback: central server login failed: ${e}`);
    return localLogin(models, email, password);
  }
}

export async function loginHandler(req, res, next) {
  const { body, models, deviceId } = req;
  const { email, password } = body;

  // no permission needed for login
  req.flagPermissionChecked();

  try {
    const { central, user, localisation } = await centralServerLoginWithLocalFallback(
      models,
      email,
      password,
      deviceId,
    );
    const [facility, permissions, token, role] = await Promise.all([
      models.Facility.findByPk(config.serverFacilityId),
      getPermissionsForRoles(models, user.role),
      getToken(user),
      models.Role.findByPk(user.role),
    ]);
    res.send({
      token,
      central,
      localisation,
      permissions,
      role: role?.forResponse() ?? null,
      server: {
        facility: facility?.forResponse() ?? null,
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function refreshHandler(req, res) {
  const { user } = req;

  // Run after auth middleware, requires valid token but no other permission
  req.flagPermissionChecked();

  const token = await getToken(user);
  res.send({ token });
}

function decodeToken(token) {
  return verify(token, jwtSecretKey);
}

async function getUserFromToken(request) {
  const { models, headers } = request;
  const authHeader = headers.authorization || '';
  if (!authHeader) return null;

  const bearer = authHeader.match(/Bearer (\S*)/);
  if (!bearer) {
    throw new BadAuthenticationError('Missing auth token header');
  }

  const token = bearer[1];
  try {
    const { userId } = await decodeToken(token);
    const user = await models.User.findByPk(userId);
    if (user.visibilityStatus !== VISIBILITY_STATUSES.CURRENT) {
      throw new Error('User is not visible to the system'); // will be caught immediately
    }
    return user;
  } catch (e) {
    throw new BadAuthenticationError(
      'Your session has expired or is invalid. Please log in again.',
    );
  }
}

export const authMiddleware = async (req, res, next) => {
  try {
    // eslint-disable-next-line require-atomic-updates
    req.user = await getUserFromToken(req);
    req.getLocalisation = async () =>
      req.models.UserLocalisationCache.getLocalisation({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']],
      });

    const spanAttributes = req.user
      ? {
          'enduser.id': req.user.id,
          'enduser.role': req.user.role,
        }
      : {};

    // eslint-disable-next-line no-unused-expressions
    trace.getActiveSpan()?.setAttributes(spanAttributes);
    context.with(
      propagation.setBaggage(context.active(), propagation.createBaggage(spanAttributes)),
      () => next(),
    );
  } catch (e) {
    next(e);
  }
};
