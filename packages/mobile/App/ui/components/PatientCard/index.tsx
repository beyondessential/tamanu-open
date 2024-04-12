import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { ColumnView, RowView, StyledText, StyledView } from '/styled/common';
import { DateFormats } from '/helpers/constants';
import { formatDate, getDisplayAge } from '/helpers/date';
import { UserAvatar } from '../UserAvatar';
import { Orientation, screenPercentageToDP } from '/helpers/screen';
import * as styles from './styles';
import { theme } from '/styled/theme';
import { getGender, joinNames } from '../../helpers/user';
import { IPatient } from '~/types';
import { useLocalisation } from '~/ui/contexts/LocalisationContext';
import { TranslatedText } from '/components/Translations/TranslatedText';

export interface PatientCardProps {
  patient: IPatient;
  onPress: Function;
}

export const PatientCard = ({ patient, onPress }: PatientCardProps): JSX.Element => {
  const { firstName, lastName, dateOfBirth, sex, village } = patient;

  // TODO: These fields aren't on the patient model yet.
  const image = null;
  const lastViewed = new Date();

  const name = joinNames({ firstName, lastName });

  const { getLocalisation } = useLocalisation();
  const ageDisplayFormat = getLocalisation('ageDisplayFormat');

  return (
    <TouchableWithoutFeedback onPress={(): void => onPress()}>
      <styles.StyledCardContainer>
        <RowView
          justifyContent="space-between"
          height={screenPercentageToDP(5.46, Orientation.Height)}
          width="100%"
        >
          <UserAvatar
            size={screenPercentageToDP(4.86, Orientation.Height)}
            displayName={name}
            image={image}
            sex={sex}
          />
          <StyledText
            color={theme.colors.TEXT_DARK}
            fontSize={screenPercentageToDP(1.09, Orientation.Height)}
            fontWeight={500}
          >
            <TranslatedText stringId="patient.lastViewed.title" fallback="Last viewed" />
            {` \n${formatDate(lastViewed, DateFormats.short)}`}
          </StyledText>
        </RowView>
        <ColumnView width="100%" marginTop={screenPercentageToDP(1.82, Orientation.Height)}>
          <StyledView width="75%" marginBottom={10}>
            <StyledText
              fontSize={screenPercentageToDP(1.82, Orientation.Height)}
              fontWeight={500}
              color={theme.colors.TEXT_DARK}
            >
              {name}
            </StyledText>
          </StyledView>
          <StyledView width="80%">
            <StyledText
              fontSize={screenPercentageToDP(1.45, Orientation.Height)}
              fontWeight={500}
              color={theme.colors.TEXT_MID}
            >
              {`${getGender(sex)}, ${getDisplayAge(dateOfBirth, ageDisplayFormat)}`}
            </StyledText>
            <StyledText
              fontSize={screenPercentageToDP(1.45, Orientation.Height)}
              fontWeight={500}
              color={theme.colors.TEXT_MID}
            >
              {village?.name ?? ''}
            </StyledText>
          </StyledView>
        </ColumnView>
      </styles.StyledCardContainer>
    </TouchableWithoutFeedback>
  );
};
