import React from 'react';
import styled from 'styled-components';
import { Colors } from '../constants';

const CardHeader = styled.div`
  border-bottom: 1px solid ${Colors.softOutline};
  padding-bottom: 10px;
  margin-bottom: 15px;
  color: ${props => props.theme.palette.text.tertiary};
  font-size: 16px;
`;

const CardBody = styled.div`
  position: relative;
  max-width: 1050px;
  display: flex;
  gap: 50px;
`;

const CardCell = styled.div`
  display: flex;
  align-items: baseline;
  font-size: ${props => props.$fontSize}px;
  line-height: 18px;
  position: relative;
  color: ${props => props.theme.palette.text.tertiary};
  white-space: ${props => props.$whiteSpace ? props.$whiteSpace : 'nowrap'};
`;

const CardIcon = styled.img`
  position: relative;
  top: 2px;
  margin-right: 10px;
`;

const CardLabel = styled.span`
  white-space: nowrap;
  color: ${props => props.theme.palette.text.secondary};
`;

const CardValue = styled.span`
  font-weight: 500;
  color: ${props => props.theme.palette.text.primary};
`;

const Card = styled.div`
  background: white;
  box-shadow: ${({ $elevated }) => ($elevated ? '2px 2px 25px rgba(0, 0, 0, 0.1)' : 'none')};
  border-bottom: 1px solid ${Colors.softOutline};
  padding: ${props => `${props.$contentPadding ?? 32}px`};
  padding-top: ${props => `${props.$paddingTop ?? props.$contentPadding}px`};
  ${CardLabel} {
    ${({ $inlineValues }) => ($inlineValues ? 'margin-right: 5px' : 'margin-bottom: 8px')};
    &:first-child:after {
      content: ${({ $inlineValues }) => ($inlineValues ? "':'" : '')};
    }
  }
  ${CardValue} {
    display: ${({ $inlineValues }) => ($inlineValues ? 'inline' : 'block')};
  }
`;

const InfoCardEntry = ({ label, value }) => (
  <div>
    <CardLabel>{label}</CardLabel>
    <CardValue>{value}</CardValue>
  </div>
);

export const EncounterInfoCardHeader = ({ label, value, ...props }) => (
  <CardHeader {...props}>
    <InfoCardEntry label={label} value={value} />
  </CardHeader>
);

export const EncounterInfoCardItem = ({
  label,
  value,
  numberOfColumns = 2,
  fontSize = 14,
  borderHeight,
  icon,
  ...props
}) => (
  <CardCell
    $numberOfColumns={numberOfColumns}
    $fontSize={fontSize}
    $borderHeight={borderHeight}
    {...props}
  >
    <CardIcon src={icon}/>
    <InfoCardEntry label={label} value={value} icon={icon} />
  </CardCell>
);

export const EncounterInfoCard = ({
  children,
  elevated,
  contentPadding,
  paddingTop,
  inlineValues,
  headerContent = null,
  numberOfColumns = 2,
}) => (
  <Card 
    $elevated={elevated} 
    $inlineValues={inlineValues} 
    $contentPadding={contentPadding} 
    $paddingTop={paddingTop}
  >
    {headerContent}
    <CardBody $numberOfColumns={numberOfColumns}>{children}</CardBody>
  </Card>
);
