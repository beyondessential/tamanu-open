import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Toolbar, Typography } from '@material-ui/core';
import { ENCOUNTER_TYPES } from '@tamanu/constants';
import { Colors } from '../constants';

// Default height of the top bar
export const TOP_BAR_HEIGHT = 66;

const TopBarHeading = styled(Typography)`
  flex: 1;
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0;
  color: ${props => props.theme.palette.text.primary};
  min-width: 250px;
`;

const AppBar = styled.div`
  position: sticky;
  height: ${TOP_BAR_HEIGHT}px;
  top: 0;
  z-index: 9;
  flex-grow: 1;
  background-color: ${Colors.white};
`;

const Bar = styled(Toolbar)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 25px;
  padding-right: 25px;
`;

const Dot = styled.span`
  height: 15px;
  width: 15px;
  background-color: ${props => props.color};
  border-radius: 50%;
  margin-right: 10px;
  flex-shrink: 0;
`;

export const TopBar = React.memo(({ title, subTitle, children, className, encounterType }) => {
  const dotColors = {
    [ENCOUNTER_TYPES.ADMISSION]: Colors.safe,
    [ENCOUNTER_TYPES.CLINIC]: '#F9BA5B', 
    [ENCOUNTER_TYPES.TRIAGE]: Colors.orange,
    [ENCOUNTER_TYPES.OBSERVATION]: Colors.orange, 
    [ENCOUNTER_TYPES.EMERGENCY]: Colors.orange,       
  };

  return <AppBar className={className}>
    <Bar>
      {dotColors[encounterType] && <Dot color={dotColors[encounterType]}/>}
      {title && <TopBarHeading variant="h3">
        {title}
        {subTitle && ` | ${subTitle}`}
      </TopBarHeading>}
      {children}
    </Bar>
  </AppBar>
});

TopBar.propTypes = {
  title: PropTypes.node,
  subTitle: PropTypes.string,
  className: PropTypes.string,
};

TopBar.defaultProps = {
  title: null,
  subTitle: null,
  className: '',
};

export const SimpleTopBar = React.memo(({ title, children, className }) => (
  <AppBar className={className}>
    <Bar>
      <TopBarHeading variant="h1">{title}</TopBarHeading>
      {children}
    </Bar>
  </AppBar>
));

SimpleTopBar.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
};

SimpleTopBar.defaultProps = {
  title: null,
  className: '',
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  flex: 2;
  flex-grow: 0;
  padding-left: 5px;
  justify-content: end;
`;

const StaticTopBar = styled(TopBar)`
  position: relative;
  z-index: 1;
`;

export const EncounterTopBar = ({ title, subTitle, children, encounter }) => (
  <StaticTopBar title={title} subTitle={subTitle} encounterType={encounter.encounterType}>
    <Container>
      {children}
    </Container>
  </StaticTopBar>
);

EncounterTopBar.propTypes = {
  title: PropTypes.string.isRequired,
  encounter: PropTypes.shape({ startDate: PropTypes.string, examiner: PropTypes.object })
    .isRequired,
  subTitle: PropTypes.string,
};

EncounterTopBar.defaultProps = {
  subTitle: null,
};
