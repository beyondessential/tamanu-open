import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { FormModal } from './FormModal';
import { DocumentForm } from '../forms/DocumentForm';
import { TranslatedText } from './Translation/TranslatedText';

export const DocumentModal = React.memo(({ open, onClose, endpoint, refreshTable }) => {
  const [preventClose, setPreventClose] = useState(false);

  const handleClose = useCallback(() => {
    // Prevent user from navigating away if we're submitting a document
    if (!preventClose) {
      onClose();
    }
  }, [preventClose, onClose]);

  const onStart = useCallback(() => setPreventClose(true), [setPreventClose]);
  const onError = useCallback(() => setPreventClose(false), [setPreventClose]);
  const onSubmit = useCallback(() => {
    setPreventClose(false);
    handleClose();
    refreshTable();
  }, [setPreventClose, handleClose, refreshTable]);

  useEffect(() => {
    function handleBeforeUnload(event) {
      if (preventClose) {
        // According to the electron docs, using event.returnValue is
        // is recommended rather than just returning a value.
        // https://www.electronjs.org/docs/latest/api/browser-window#event-close
        // eslint-disable-next-line no-param-reassign
        event.returnValue = false;
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [preventClose]);

  return (
    <FormModal
      width="md"
      title={<TranslatedText stringId="document.modal.create.title" fallback="Add document" />}
      open={open}
      onClose={handleClose}
    >
      <DocumentForm
        onSubmit={onSubmit}
        onStart={onStart}
        onError={onError}
        onCancel={handleClose}
        editedObject={document}
        endpoint={endpoint}
      />
    </FormModal>
  );
});

DocumentModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  endpoint: PropTypes.string.isRequired,
  refreshTable: PropTypes.func.isRequired,
};

DocumentModal.defaultProps = {
  open: false,
};
