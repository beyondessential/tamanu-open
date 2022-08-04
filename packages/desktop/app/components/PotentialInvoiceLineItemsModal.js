import React from 'react';

import { INVOICE_LINE_TYPE_LABELS } from 'shared/constants';
import { useApi } from '../api';

import { Modal } from './Modal';
import { ButtonRow } from './ButtonRow';
import { Button } from './Button';
import { DateDisplay } from './DateDisplay';
import { DataFetchingTable } from './Table';

const COLUMNS = [
  { key: 'date', title: 'Date', accessor: ({ date }) => <DateDisplay date={date} /> },
  { key: 'code', title: 'Code' },
  {
    key: 'type',
    title: 'Category',
    accessor: ({ type }) => INVOICE_LINE_TYPE_LABELS[type] || 'Unknown',
  },
  { key: 'orderedBy', title: 'Ordered by' },
  { key: 'price', title: 'Price', accessor: ({ price }) => `$${price}` },
];

export const PotentialInvoiceLineItemsModal = ({ open, onClose, invoiceId, onSaved }) => {
  const api = useApi();
  const addPotentialLineItems = () => api.post(`invoices/${invoiceId}/potentialLineItems`);

  return (
    <Modal width="md" title="Potential invoice line items" open={open} onClose={onClose}>
      <DataFetchingTable
        endpoint={`invoices/${invoiceId}/potentialLineItems`}
        columns={COLUMNS}
        noDataMessage="No potential invoice line items found"
        allowExport={false}
      />
      <ButtonRow>
        <Button variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            await addPotentialLineItems();
            onSaved();
          }}
          color="primary"
        >
          Add
        </Button>
      </ButtonRow>
    </Modal>
  );
};
