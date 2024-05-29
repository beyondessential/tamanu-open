import { useCallback, useEffect, useState } from 'react';
import { extension } from 'mime-types';

import { useApi } from '../api';
import { notify, notifyError, notifySuccess } from '../utils';
import { saveFile } from '../utils/fileSystemAccess';

const base64ToUint8Array = base64 => {
  const binString = atob(base64);
  return Uint8Array.from(binString, m => m.codePointAt(0));
};

export const useDocumentActions = () => {
  const api = useApi();
  const [dataUrl, setDataUrl] = useState('');

  // In order to make sure we cleanup any iframes we create from printing, we need to
  // trigger it in a useEffect with a cleanup function that wil remove the iframe
  // when unmounted.
  useEffect(() => {
    if (!dataUrl) return () => {};

    // create iframe & print when dataurl is loaded
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = dataUrl;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow.print();
    };

    return () => {
      // cleanup iframe when leaving documents tab
      document.body.removeChild(iframe);
    };
  }, [dataUrl]);

  const onDownload = useCallback(
    async document => {
      try {
        // Give feedback to user that download is starting
        notify('Your download has started, please wait.', { type: 'info' });

        // Download attachment (*currently the API only supports base64 responses)
        const { data } = await api.get(`attachment/${document.attachmentId}`, {
          base64: true,
        });

        await saveFile({
          defaultFileName: document.name,
          data: base64ToUint8Array(data),
          extension: extension(document.type),
          mimetype: document.type,
        });

        notifySuccess('Successfully downloaded file');
      } catch (error) {
        notifyError(error.message);
      }
    },
    [api],
  );

  const onPrintPDF = useCallback(
    async attachmentId => {
      try {
        const { data } = await api.get(`attachment/${attachmentId}`, {
          base64: true,
        });
        const url = URL.createObjectURL(
          new Blob([Buffer.from(data, 'base64').buffer], { type: 'application/pdf' }),
        );

        // Triggers the useEffect that handles printing logic
        setDataUrl(url);
      } catch (error) {
        notifyError(error.message);
      }
    },
    [api],
  );

  return { onDownload, onPrintPDF };
};
