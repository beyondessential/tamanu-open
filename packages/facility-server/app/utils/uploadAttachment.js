import fs, { promises as asyncFs } from 'fs';
import { InvalidParameterError, RemoteCallFailedError } from '@tamanu/shared/errors';
import { getUploadedData } from '@tamanu/shared/utils/getUploadedData';
import { CentralServerConnection } from '../sync';

// Helper function for uploading one file to the central server
// req: express request, maxFileSize: integer (size in bytes)
export const uploadAttachment = async (req, maxFileSize) => {
  // TODO: Figure out permission management for writing
  // an Attachment
  // req.checkPermission('write', 'Attachment'); ??

  // Read request and extract file, stats and metadata
  const { deviceId } = req;
  const { file, deleteFileAfterImport, type, ...metadata } = await getUploadedData(req);
  const { size } = fs.statSync(file);
  const fileData = await asyncFs.readFile(file, { encoding: 'base64' });

  // Parsed file needs to be deleted from memory
  if (deleteFileAfterImport) fs.unlink(file, () => null);

  // Check file size constraint
  if (maxFileSize && size > maxFileSize) {
    throw new InvalidParameterError(`Uploaded file exceeds limit of ${maxFileSize} bytes.`);
  }

  // Upload file to central server
  // CentralServerConnection takes care of adding headers and convert body to JSON
  const centralServer = new CentralServerConnection({ deviceId });
  const syncResponse = await centralServer.fetch('attachment', {
    method: 'POST',
    body: {
      type,
      size,
      data: fileData,
    },
    backoff: { maxAttempts: 1 },
  });

  if (syncResponse.error) {
    throw new RemoteCallFailedError(syncResponse.error.message);
  }

  // Send parsed metadata along with the new created attachment id
  return {
    attachmentId: syncResponse.attachmentId,
    type,
    metadata,
  };
};
