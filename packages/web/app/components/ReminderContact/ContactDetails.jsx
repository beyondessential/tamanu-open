import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { Colors } from '../../constants';
import { useAuth } from '../../contexts/Auth';
import { TextButton } from '../Button';
import { DataFetchingTable, Table } from '../Table';
import { joinNames } from '../../utils/user';
import { useTranslation } from '../../contexts/Translation';
import { TranslatedText } from '../Translation/TranslatedText';
import { useSocket } from '../../utils/useSocket';
import { WS_EVENTS } from '@tamanu/constants';

const StyledText = styled(Typography)`
  margin: 14px 0px 30px 0;
  font-size: 14px;
  line-height: 18px;

  span {
    font-weight: 500;
  }
`;

const StyledTextButton = styled(TextButton)`
  font-size: 14px;
  line-height: 18px;
  text-decoration: underline;
  color: ${Colors.darkestText};
  .MuiButton-label {
    font-weight: 400;
  }
`;

const StyledContactListTable = styled(DataFetchingTable)`
  display: ${props => (props.isEmpty ? 'none' : 'block')};
  margin-bottom: 28px;
  border-radius: 5px;
  border: 1px solid ${Colors.outline};
  background: ${Colors.white};
  box-shadow: none;

  table {
    padding-left: 21px;
    padding-right: 25px;
    padding-bottom: 16px;
  }

  table thead th {
    background-color: ${Colors.white} !important;
    border-bottom: 1px solid ${Colors.outline};
    padding: 13px 0 12px 2px;
    padding-left: 2px !important;
    width: 30%;
    &: 4th-child {
      width: 10%;
    }
  }

  table thead th tr {
    font-size: 14px;
    font-style: normal;
    line-height: 18px;
  }

  table tbody td {
    padding-left: 2px !important;
    padding-top: 14px !important;
    padding-bottom: 0 !important;
    border-bottom: none;
  }
`;

const RowActionLink = styled.a`
  text-decoration: underline;
  cursor: pointer;
`;

const ColoredText = styled.span`
  color: ${props => props.color};
`;

const ContactDetailTable = styled(Table)`
  border: 1px solid ${Colors.outline};
  box-shadow: none;
  margin: 22px 0 42px;
  border-radius: 5px;
  background: ${Colors.white};

  table {
    padding-left: 23px;
    padding-right: 20px;

    thead tr {
      border-bottom: 1px solid ${Colors.outline};

      th {
        font-style: normal;
        background-color: ${Colors.white} !important;
        padding: 13px 0 12px !important;
        font-size: 14px;
        line-height: 18px;
        font-weight: 500;
        width: 30%;
      }
    }

    tbody tr td {
      border-bottom: none;
      padding: 10px 0 16px 1px !important;
    }
  }
`;

const CONNECTION_STATUS = {
  SUCCESS: 'success',
  PENDING: 'pending',
  FAILED: 'failed',
};

const ColoredCellText = ({ children, status }) => {
  switch (status) {
    case CONNECTION_STATUS.FAILED:
      return <ColoredText color={Colors.alert}>{children}</ColoredText>;
    case CONNECTION_STATUS.PENDING:
      return <ColoredText color={Colors.softText}>{children}</ColoredText>;
    default:
      return <span>{children}</span>;
  }
};

export const ContactDetails = ({
  pendingContacts,
  onRetry,
  successContactIds,
  onRemoveContact,
  selectedContact,
  isRemoveModal = false,
}) => {
  const { socket } = useSocket();
  const { getTranslation } = useTranslation();
  const patient = useSelector(state => state.patient);
  const patientName = joinNames(patient);
  const [isEmpty, setIsEmpty] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const { ability } = useAuth();
  const canRemoveReminderContacts = ability.can('write', 'Patient');

  const unsubscribersListener = useCallback(() => {
    setRefreshCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    socket.on(WS_EVENTS.TELEGRAM_UNSUBSCRIBE_SUCCESS, unsubscribersListener);
    return () => socket.off(WS_EVENTS.TELEGRAM_UNSUBSCRIBE_SUCCESS, unsubscribersListener);
  }, []);

  const onDataFetched = ({ count }) => {
    setIsEmpty(!count);
  };

  const getStatus = (isTimerStarted = false, contactId, connectionDetails) => {
    if (successContactIds.includes(contactId) || !!connectionDetails) {
      return CONNECTION_STATUS.SUCCESS;
    }
    if (isTimerStarted) {
      return CONNECTION_STATUS.PENDING;
    }
    return CONNECTION_STATUS.FAILED;
  };

  const getMethod = (status, method) => {
    let methodText;
    switch (status) {
      case CONNECTION_STATUS.FAILED:
        methodText = (
          <TranslatedText
            stringId="patient.details.reminderContacts.status.failed"
            fallback="Failed"
          />
        );
        break;
      case CONNECTION_STATUS.PENDING:
        methodText = (
          <TranslatedText
            stringId="patient.details.reminderContacts.status.pending"
            fallback=":method pending"
            replacements={{ method }}
          />
        );
        break;
      case CONNECTION_STATUS.SUCCESS:
        methodText = (
          <TranslatedText
            stringId={`patient.details.reminderContacts.method.${method}`}
            fallback={method}
          />
        );
        break;
    }
    return <ColoredCellText status={status}>{methodText}</ColoredCellText>;
  };

  const columns = [
    {
      key: 'name',
      title: (
        <TranslatedText
          stringId="patient.details.reminderContacts.field.contact"
          fallback="Contact"
        />
      ),
      sortable: false,
      accessor: ({ id, connectionDetails, name }) => (
        <ColoredCellText
          status={getStatus(pendingContacts[id]?.isTimerStarted, id, connectionDetails)}
        >
          {name}
        </ColoredCellText>
      ),
    },
    {
      key: 'relationship.name',
      title: (
        <TranslatedText
          stringId="patient.details.reminderContacts.field.relationship"
          fallback="Relationship"
        />
      ),
      sortable: false,
      accessor: ({ id, connectionDetails, relationship }) => (
        <ColoredCellText
          status={getStatus(pendingContacts[id]?.isTimerStarted, id, connectionDetails)}
        >
          {relationship.name}
        </ColoredCellText>
      ),
    },
    {
      key: 'method',
      title: (
        <TranslatedText
          stringId="patient.details.reminderContacts.field.contactMethod"
          fallback="Contact method"
        />
      ),
      sortable: false,
      accessor: ({ id, connectionDetails, method }) =>
        getMethod(getStatus(pendingContacts[id]?.isTimerStarted, id, connectionDetails), method),
    },
    ...(canRemoveReminderContacts && !isRemoveModal
      ? [
          {
            key: '',
            title: '',
            sortable: false,
            accessor: data => {
              return (
                <StyledTextButton onClick={() => onRemoveContact(data)}>
                  <TranslatedText
                    stringId="patient.details.reminderContacts.action.remove"
                    fallback="Remove"
                  />
                </StyledTextButton>
              );
            },
          },
        ]
      : []),
    ...(!isRemoveModal
      ? [
          {
            key: '',
            title: '',
            sortable: false,
            accessor: row =>
              getStatus(pendingContacts[row.id]?.isTimerStarted, row.id, row.connectionDetails) ===
              CONNECTION_STATUS.FAILED ? (
                <RowActionLink onClick={() => onRetry(row)}>
                  <TranslatedText stringId="general.action.retry" fallback="Retry" />
                </RowActionLink>
              ) : (
                ''
              ),
          },
        ]
      : []),
  ];

  if (isRemoveModal) {
    return <ContactDetailTable columns={columns} allowExport={false} data={[selectedContact]} />;
  }

  return (
    <>
      {isEmpty ? (
        <StyledText
          dangerouslySetInnerHTML={{
            __html: getTranslation(
              'patient.details.reminderContacts.emptyDescription',
              "There are no contacts registered to receive reminders for :patientName. Please select 'Add contact' to register a contact.",
              { patientName: `<span>${patientName}</span>` },
            ),
          }}
        ></StyledText>
      ) : (
        <StyledText
          dangerouslySetInnerHTML={{
            __html: getTranslation(
              'patient.details.reminderContacts.description',
              'The below contact list is registered to receive reminders for :patientName.',
              { patientName: `<span>${patientName}</span>` },
            ),
          }}
        ></StyledText>
      )}
      <StyledContactListTable
        columns={columns}
        endpoint={`/patient/${patient.id}/reminderContacts`}
        disablePagination
        initialSort={{ orderBy: 'name', order: 'asc' }}
        allowExport={false}
        onDataFetched={onDataFetched}
        isEmpty={isEmpty}
        refreshCount={refreshCount}
      />
    </>
  );
};
