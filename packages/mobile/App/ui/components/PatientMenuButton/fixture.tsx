import React from 'react';
import { ThemeProvider } from 'styled-components';
import { RowView, StyledView, themeSystem } from '/styled/common';
import { PatientMenuButton } from './index';
import {
  SickOrInjuredIcon,
  CheckUpIcon,
  PregnancyIcon,
  FamilyPlanningIcon,
  VaccineIcon,
  DeceasedIcon,
} from '../Icons';

export const BaseStory = (): JSX.Element => (
  <ThemeProvider theme={themeSystem}>
    <StyledView width="100%">
      <RowView width="100%" paddingLeft={15} paddingRight={15}>
        <PatientMenuButton
          title={'Sick \n or Injured'}
          Icon={SickOrInjuredIcon}
          onPress={(): void => console.log('here')}
        />
        <StyledView marginLeft={8} marginRight={8}>
          <PatientMenuButton
            title="Check up"
            Icon={CheckUpIcon}
            onPress={(): void => console.log('here')}
          />
        </StyledView>
        <PatientMenuButton
          title="Programs"
          Icon={PregnancyIcon}
          onPress={(): void => console.log('here')}
        />
      </RowView>
      <RowView width="100%" marginTop={8} paddingLeft={15} paddingRight={15}>
        <PatientMenuButton
          title="Referral"
          Icon={FamilyPlanningIcon}
          onPress={(): void => console.log('here')}
        />
        <StyledView marginLeft={8} marginRight={8}>
          <PatientMenuButton
            title="Vaccine"
            Icon={VaccineIcon}
            onPress={(): void => console.log('here')}
          />
        </StyledView>
        <PatientMenuButton
          title="Deceased"
          Icon={DeceasedIcon}
          onPress={(): void => console.log('here')}
        />
      </RowView>
    </StyledView>
  </ThemeProvider>
);
