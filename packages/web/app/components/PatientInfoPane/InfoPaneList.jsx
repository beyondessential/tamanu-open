import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Button, Collapse, Typography } from '@material-ui/core';
import { kebabCase } from 'lodash';
import { PATIENT_ISSUE_TYPES } from '@tamanu/constants';
import { Colors } from '../../constants';
import { FormModal } from '../FormModal';
import { PatientAlert } from '../PatientAlert';
import { InfoPaneAddEditForm } from './InfoPaneAddEditForm';
import { PANE_SECTION_IDS } from './paneSections';
import { useApi } from '../../api';

const TitleContainer = styled.div`
  color: ${Colors.primary};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebebeb;
  padding-bottom: 0.5rem;
`;

const TitleText = styled(Typography)`
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
`;

const AddButton = styled(Button)`
  text-transform: none;

  .MuiButton-label {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0;
    color: ${Colors.primary};
  }

  .MuiSvgIcon-root {
    color: ${Colors.secondary};
  }
`;

const DataList = styled.ul`
  margin: 0.5rem 0;
  padding: 0;
`;

const ListItem = styled.li`
  display: block;
  margin: 6px 0;
  cursor: pointer;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
`;

const shouldShowIssueInWarningModal = ({ type }) => type === PATIENT_ISSUE_TYPES.WARNING;

const getItems = (isIssuesPane, response) => {
  const items = response?.data || [];
  if (isIssuesPane === false) {
    return { items, warnings: null };
  }

  const warnings = items.filter(shouldShowIssueInWarningModal);
  const sortedIssues = [
    ...warnings,
    ...items.filter(issue => !shouldShowIssueInWarningModal(issue)),
  ];

  return { items: sortedIssues, warnings };
};

export const InfoPaneList = ({
  id: paneId,
  patient,
  readonly,
  title,
  Form,
  endpoint,
  getEndpoint,
  getName = () => '???',
  behavior = 'collapse',
  itemTitle = '',
  CustomEditForm,
  getEditFormName = () => '???',
  ListItemComponent,
  overrideContentPadding,
}) => {
  const [addEditState, setAddEditState] = useState({ adding: false, editKey: null });
  const { adding, editKey } = addEditState;
  const api = useApi();
  const { data, error } = useQuery([`infoPaneListItem-${paneId}`, patient.id], () =>
    api.get(getEndpoint),
  );

  const isIssuesPane = paneId === PANE_SECTION_IDS.ISSUES;
  const { items, warnings } = getItems(isIssuesPane, data);

  const handleAddButtonClick = useCallback(
    () => setAddEditState({ adding: !adding, editKey: null }),
    [adding],
  );
  const handleRowClick = useCallback(id => setAddEditState({ adding: false, editKey: id }), []);
  const handleCloseForm = useCallback(() => setAddEditState({ adding: false, editKey: null }), []);

  const Wrapper = props =>
    behavior === 'collapse' ? (
      <Collapse in={adding} {...props} />
    ) : (
      <FormModal
        width="md"
        title={itemTitle}
        open={adding}
        onClose={handleCloseForm}
        {...props}
        overrideContentPadding={overrideContentPadding}
      />
    );

  const addForm = (
    <Wrapper>
      <InfoPaneAddEditForm
        Form={Form}
        endpoint={endpoint}
        onClose={handleCloseForm}
        id={paneId}
        items={items}
      />
    </Wrapper>
  );

  const EditForm = CustomEditForm || InfoPaneAddEditForm;
  return (
    <>
      {isIssuesPane && <PatientAlert alerts={warnings} />}
      <TitleContainer data-test-id={`info-pane-${kebabCase(title)}`}>
        <TitleText>{title}</TitleText>
        {!readonly && (
          <AddButton
            onClick={handleAddButtonClick}
            endIcon={<AddCircleIcon />}
            data-test-class="add-button-section"
          >
            Add
          </AddButton>
        )}
      </TitleContainer>
      <DataList>
        {error && error.message}
        {!error &&
          items.map(item => {
            const { id } = item;
            const name = getName(item);
            if (behavior === 'collapse') {
              return (
                <React.Fragment key={id}>
                  <Collapse in={editKey !== id}>
                    {ListItemComponent ? (
                      <ListItemComponent
                        item={item}
                        handleRowClick={handleRowClick}
                        ListItem={ListItem}
                      />
                    ) : (
                      <ListItem onClick={() => handleRowClick(id)}>{name}</ListItem>
                    )}
                  </Collapse>
                  <Collapse in={editKey === id}>
                    <EditForm
                      Form={Form}
                      endpoint={endpoint}
                      item={item}
                      onClose={handleCloseForm}
                      id={paneId}
                      items={items}
                    />
                  </Collapse>
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={id}>
                {ListItemComponent ? (
                  <ListItemComponent
                    item={item}
                    handleRowClick={handleRowClick}
                    ListItem={ListItem}
                  />
                ) : (
                  <ListItem onClick={() => handleRowClick(id)}>{name}</ListItem>
                )}
                <FormModal
                  width="md"
                  title={getEditFormName(item)}
                  open={editKey === id}
                  onClose={handleCloseForm}
                  overrideContentPadding={overrideContentPadding}
                >
                  <EditForm
                    Form={Form}
                    endpoint={endpoint}
                    item={item}
                    handleRowClick={handleRowClick}
                    ListItem={ListItem}
                  />
                </FormModal>
              </React.Fragment>
            );
          })}
        {addForm}
      </DataList>
    </>
  );
};
