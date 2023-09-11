import { SemanticAttributes as OpenTelSemantics } from '@opentelemetry/semantic-conventions';
import config from 'config';
import shortid from 'shortid';
import os from 'os';

export const ENV = process.env.NODE_ENV ?? 'development';
export const PROCESS_ID = shortid.generate();
export const HOSTNAME = os.hostname();

export const SemanticAttributes = {
  ...OpenTelSemantics,
  DEPLOYMENT_NAME: 'deployment.name',
  DEPLOYMENT_ENVIRONMENT: 'deployment.environment',
  DEPLOYMENT_FACILITY: 'deployment.facility',
  SERVICE_TYPE: 'service.type',
  SERVICE_VERSION: 'service.version',
};

export function serviceContext() {
  const { serverType = 'unknown', version = '0.0.0' } = global?.serverInfo || {};
  const deploymentHost = config?.canonicalHostName || config?.sync?.host;
  const deployment =
    deploymentHost && new URL(deploymentHost).hostname.replace(/[^a-z0-9]+/gi, '-');
  const facilityId = config?.serverFacilityId?.replace(/([^a-z0-9]+|^(ref\/)?facility[-/])/gi, '');

  return {
    [SemanticAttributes.NET_HOST_NAME]: HOSTNAME,
    [SemanticAttributes.PROCESS_ID]: PROCESS_ID,
    [SemanticAttributes.DEPLOYMENT_NAME]: deployment,
    [SemanticAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
    [SemanticAttributes.DEPLOYMENT_FACILITY]: facilityId,
    [SemanticAttributes.SERVICE_TYPE]: serverType,
    [SemanticAttributes.SERVICE_VERSION]: version,
  };
}

export function serviceName(context) {
  if (!context[SemanticAttributes.DEPLOYMENT_NAME]) return null;

  return [
    context[SemanticAttributes.DEPLOYMENT_NAME],
    context[SemanticAttributes.SERVICE_TYPE],
    context[SemanticAttributes.DEPLOYMENT_FACILITY],
  ]
    .filter(Boolean)
    .join('-');
}
