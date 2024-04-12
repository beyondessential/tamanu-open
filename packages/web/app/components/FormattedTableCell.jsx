import { isNumber } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import styled from 'styled-components';
import { Colors } from '../constants';
import { DateDisplay, formatLong, formatShortest, formatTime } from './DateDisplay';
import { TableTooltip } from './Table/TableTooltip';

// severity constants
const ALERT = 'alert';
const INFO = 'info';

const CellWrapper = styled.div`
  background: ${({ severity }) => (severity === ALERT ? `${Colors.alert}20` : 'transparent')};
  border-radius: 10px;
  padding: 8px 14px;
  margin: -8px ${({ severity }) => (severity === ALERT ? '0px' : '-14px')};
  width: fit-content;
`;

const ClickableCellWrapper = styled(CellWrapper)`
  cursor: pointer;

  &:hover {
    background: ${({ severity }) => (severity === ALERT ? `${Colors.alert}40` : Colors.background)};
  }
`;

const HeadCellWrapper = styled.div`
  display: block;
  width: fit-content;
  div {
    color: ${Colors.midText};
    :first-child {
      color: ${Colors.darkText};
    }
  }
`;

function round(float, { rounding } = {}) {
  if (isNaN(float) || !isNumber(rounding)) {
    return float;
  }
  return float.toFixed(rounding);
}

function getTooltip(float, config = {}, visibilityCriteria = {}) {
  const { unit = '' } = config;
  const { normalRange } = visibilityCriteria;
  if (normalRange && float < normalRange.min) {
    return {
      tooltip: `Outside normal range\n <${normalRange.min}${unit}`,
      severity: ALERT,
    };
  }
  if (normalRange && float > normalRange.max) {
    return {
      tooltip: `Outside normal range\n >${normalRange.max}${unit}`,
      severity: ALERT,
    };
  }
  if (unit?.length > 2 && !isNaN(float)) {
    return {
      tooltip: `${round(float, config)}${unit}`,
      severity: INFO,
    };
  }
  return {
    severity: INFO,
  };
}

export const formatValue = (value, config) => {
  const { rounding = 0, unit = '' } = config || {};
  const float = parseFloat(value);

  if (isNaN(float)) {
    return value || '-';
  }

  const unitSuffix = unit && unit.length <= 2 ? unit : '';
  if (rounding > 0 || rounding === 0) {
    return `${float.toFixed(rounding)}${unitSuffix}`;
  }
  return `${float}${unitSuffix}`;
};

export const DateHeadCell = React.memo(({ value }) => (
  <TableTooltip title={DateDisplay.stringFormat(value, formatLong)}>
    <HeadCellWrapper>
      <div>{DateDisplay.stringFormat(value, formatShortest)}</div>
      <div>{DateDisplay.stringFormat(value, formatTime)}</div>
    </HeadCellWrapper>
  </TableTooltip>
));

const LimitedLinesCellWrapper = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ maxLines }) =>
    maxLines <= 1
      ? ''
      : `
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: ${maxLines};
  `}
  ${({ maxWidth }) => maxWidth && `max-width: ${maxWidth};`};
`;

export const LimitedLinesCell = ({ value, maxWidth, maxLines = 2 }) => {
  const contentRef = useRef(null);
  const [isClamped, setClamped] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // isClamped logic inspired by: https://stackoverflow.com/a/74255034/11324801
  useEffect(() => {
    const handleResize = () => {
      if (contentRef && contentRef.current) {
        const { scrollHeight, clientHeight, scrollWidth, clientWidth } = contentRef.current;
        setClamped(scrollHeight > clientHeight || scrollWidth > clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  return (
    <TableTooltip
      title={value}
      open={isClamped && tooltipOpen}
      onOpen={() => setTooltipOpen(true)}
      onClose={() => setTooltipOpen(false)}
    >
      <LimitedLinesCellWrapper ref={contentRef} maxLines={maxLines} maxWidth={maxWidth}>
        {value}
      </LimitedLinesCellWrapper>
    </TableTooltip>
  );
};

export const RangeTooltipCell = React.memo(({ value, config, validationCriteria }) => {
  const { unit = '' } = config || {};
  const { normalRange } = validationCriteria || {};
  const tooltip =
    normalRange && `Normal range ${normalRange.min}${unit} – ${normalRange.max}${unit}`;
  return tooltip ? (
    <TableTooltip title={tooltip}>
      <CellWrapper>{value}</CellWrapper>
    </TableTooltip>
  ) : (
    <CellWrapper>{value}</CellWrapper>
  );
});

const DefaultWrapper = ({ value }) => <>{value}</>;

export const RangeValidatedCell = React.memo(
  ({
    value,
    config,
    validationCriteria,
    onClick,
    isEdited,
    ValueWrapper = DefaultWrapper,
    ...props
  }) => {
    const CellContainer = onClick ? ClickableCellWrapper : CellWrapper;
    const float = round(parseFloat(value), config);
    const isEditedSuffix = isEdited ? '*' : '';
    const formattedValue = `${formatValue(value, config)}${isEditedSuffix}`;
    const { tooltip, severity } = useMemo(() => getTooltip(float, config, validationCriteria), [
      float,
      config,
      validationCriteria,
    ]);

    const cell = (
      <CellContainer onClick={onClick} severity={severity} {...props}>
        <ValueWrapper value={formattedValue} />
      </CellContainer>
    );

    return tooltip ? <TableTooltip title={tooltip}>{cell}</TableTooltip> : cell;
  },
);
