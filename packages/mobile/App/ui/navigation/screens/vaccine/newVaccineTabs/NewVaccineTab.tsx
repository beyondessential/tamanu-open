import React, { ReactElement, useCallback, FC, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Route } from 'react-native-tab-view';
import { SvgProps } from 'react-native-svg';
import { compose } from 'redux';
import { useSelector } from 'react-redux';
import { withPatient } from '~/ui/containers/Patient';
import { StyledSafeAreaView } from '/styled/common';
import { VaccineForm, VaccineFormValues } from '/components/Forms/VaccineForms';
import { VaccineDataProps } from '/components/VaccineCard';
import { useBackend } from '~/ui/hooks';
import { IPatient } from '~/types';
import { authUserSelector } from '~/ui/helpers/selectors';
import { VaccineStatus } from '~/ui/helpers/patient';

type NewVaccineTabProps = {
  route: Route & {
    icon: FC<SvgProps>;
    color?: string;
    vaccine: VaccineDataProps;
  };
  selectedPatient: IPatient;
};

export const NewVaccineTabComponent = ({
  route,
  selectedPatient,
}: NewVaccineTabProps): ReactElement => {
  const { vaccine } = route;
  const { administeredVaccine } = vaccine;
  const navigation = useNavigation();
  const [isSubmitting, setSubmitting] = useState(false);

  const onPressCancel = useCallback(() => {
    navigation.goBack();
  }, []);

  const user = useSelector(authUserSelector);

  const { models } = useBackend();
  const recordVaccination = useCallback(
    async (values: VaccineFormValues): Promise<void> => {
      if (isSubmitting) return;
      setSubmitting(true);
      const { scheduledVaccineId, recorderId, ...otherValues } = values;
      const encounter = await models.Encounter.getOrCreateCurrentEncounter(
        selectedPatient.id,
        user.id,
      );
      await models.AdministeredVaccine.createAndSaveOne({
        ...otherValues,
        id: administeredVaccine?.id,
        scheduledVaccine: scheduledVaccineId,
        recorder: recorderId,
        encounter: encounter.id,
      });

      navigation.goBack();
    },
    [isSubmitting],
  );

  return (
    <StyledSafeAreaView flex={1}>
      <VaccineForm
        onSubmit={recordVaccination}
        onCancel={onPressCancel}
        initialValues={{ ...vaccine, ...administeredVaccine }}
        status={route.key as VaccineStatus}
      />
    </StyledSafeAreaView>
  );
};

export const NewVaccineTab = compose(withPatient)(NewVaccineTabComponent);
