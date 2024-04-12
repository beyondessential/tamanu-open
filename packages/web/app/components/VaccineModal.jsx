import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { VACCINE_RECORDING_TYPES } from '@tamanu/constants';

import { FormModal } from './FormModal';
import { VaccineForm } from '../forms/VaccineForm';
import { SegmentTabDisplay } from './SegmentTabDisplay';
import { useApi, useSuggester } from '../api';
import { reloadPatient } from '../store/patient';
import { getCurrentUser } from '../store/auth';
import { TranslatedText } from './Translation/TranslatedText';

export const VaccineModal = ({ open, onClose, patientId }) => {
  const [currentTabKey, setCurrentTabKey] = useState(VACCINE_RECORDING_TYPES.GIVEN);

  const api = useApi();
  const countrySuggester = useSuggester('country');
  const dispatch = useDispatch();
  const currentUser = useSelector(getCurrentUser);

  const handleCreateVaccine = useCallback(
    async data => {
      const dataToSubmit = { ...data };
      if (currentTabKey === VACCINE_RECORDING_TYPES.GIVEN && data.givenElsewhere && data.givenBy) {
        const givenByCountry = (await countrySuggester.fetchCurrentOption(data.givenBy))?.label;
        dataToSubmit.givenBy = givenByCountry;
      }

      if (dataToSubmit.givenElsewhere) {
        delete dataToSubmit.departmentId;
        delete dataToSubmit.locationGroupId;
        delete dataToSubmit.locationId;
      }

      const body = {
        ...dataToSubmit,
        patientId,
        status: currentTabKey,
        recorderId: currentUser.id,
      };
      if (dataToSubmit.circumstanceIds) {
        body.circumstanceIds = JSON.parse(dataToSubmit.circumstanceIds);
      }

      await api.post(`patient/${patientId}/administeredVaccine`, body);
      dispatch(reloadPatient(patientId));
    },
    [api, dispatch, patientId, currentUser.id, currentTabKey, countrySuggester],
  );

  const getScheduledVaccines = useCallback(
    async query => api.get(`patient/${patientId}/scheduledVaccines`, query),
    [api, patientId],
  );

  const TABS = [
    {
      label: <TranslatedText stringId="vaccine.property.status.given" fallback="Given" />,
      key: VACCINE_RECORDING_TYPES.GIVEN,
      render: () => (
        <VaccineForm
          onSubmit={handleCreateVaccine}
          onCancel={onClose}
          patientId={patientId}
          getScheduledVaccines={getScheduledVaccines}
          vaccineRecordingType={VACCINE_RECORDING_TYPES.GIVEN}
        />
      ),
    },
    {
      label: <TranslatedText stringId="vaccine.property.status.notGiven" fallback="Not given" />,
      key: VACCINE_RECORDING_TYPES.NOT_GIVEN,
      render: () => (
        <VaccineForm
          onSubmit={handleCreateVaccine}
          onCancel={onClose}
          patientId={patientId}
          getScheduledVaccines={getScheduledVaccines}
          vaccineRecordingType={VACCINE_RECORDING_TYPES.NOT_GIVEN}
        />
      ),
    },
  ];

  return (
    <FormModal
      title={<TranslatedText stringId="vaccine.modal.create.title" fallback="Record vaccine" />}
      open={open}
      onClose={onClose}
      width="md"
    >
      <SegmentTabDisplay tabs={TABS} currentTabKey={currentTabKey} onTabSelect={setCurrentTabKey} />
    </FormModal>
  );
};
