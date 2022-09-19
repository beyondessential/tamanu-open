import fs, { promises as asyncFs } from 'fs';
import { InvalidParameterError, RemoteCallFailedError } from 'shared/errors';
import { getUploadedData } from 'shared/utils/getUploadedData';
import { WebRemote } from '../sync';

// Helper function for uploading one file to the sync server
// req: express request, maxFileSize: integer (size in bytes)
export const uploadAttachment = async (req, maxFileSize) => {
  // TODO: Figure out permission management for writing
  // an Attachment (this will be stored only in the sync server)
  // req.checkPermission('write', 'Attachment'); ??

  // Read request and extract file, stats and metadata
  const { file, deleteFileAfterImport, type, ...metadata } = await getUploadedData(req);
  const { size } = fs.statSync(file);
  const fileData = await asyncFs.readFile(file, { encoding: 'base64' });

  // Parsed file needs to be deleted from memory
  if (deleteFileAfterImport) fs.unlink(file, () => null);

  // Check file size constraint
  if (maxFileSize && size > maxFileSize) {
    throw new InvalidParameterError(`Uploaded file exceeds limit of ${maxFileSize} bytes.`);
  }

  // Upload file to sync server
  // WebRemote takes care of adding headers and convert body to JSON
  const remote = new WebRemote();
  const syncResponse = await remote.fetch('attachment', {
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
