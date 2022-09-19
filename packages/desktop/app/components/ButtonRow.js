import React, { Children } from 'react';
import styled from 'styled-components';

import { Button, OutlinedButton } from './Button';

const Row = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  margin-top: 10px;
  width: 100%;

  // ensure the button row takes up the full width if it's used in a grid context
  grid-column: 1 / -1;

  > button,
  > div {
    margin-left: 16px;
  }
`;

export const ButtonRow = React.memo(({ children, ...props }) => (
  <Row items={Children.toArray(children).length || 1} {...props}>
    {children}
  </Row>
));

const ConfirmButton = styled(Button)`
  min-width: 90px;
`;

export const ConfirmCancelRow = React.memo(
  ({
    onCancel,
    onConfirm,
    confirmText = 'Confirm',
    confirmColor = 'primary',
    cancelText = 'Cancel',
    confirmDisabled,
    ...props
  }) => (
    <ButtonRow {...props}>
      {onCancel && <OutlinedButton onClick={onCancel}>{cancelText}</OutlinedButton>}
      {onConfirm && (
        <ConfirmButton color={confirmColor} onClick={onConfirm} disabled={confirmDisabled}>
          {confirmText}
        </ConfirmButton>
      )}
    </ButtonRow>
  ),
);
