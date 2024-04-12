import React, { ReactElement, useState } from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import { StyledScrollView } from '/styled/common';
import { Header } from './Header';
import { Content } from './Content';

export const PatientVaccineHistoryAccordion = ({
  dataArray,
}): ReactElement => {
  const [activeSections, setActiveSections] = useState<number[]>([]);

  const updateSections = (newActiveSection: number[]): void => {
    setActiveSections(newActiveSection);
  };

  return (
    <StyledScrollView flex={1} width="100%">
      <Accordion
        sections={dataArray}
        underlayColor="transparent"
        activeSections={activeSections}
        renderHeader={Header}
        renderContent={Content}
        onChange={updateSections}
      />
    </StyledScrollView>
  );
};
