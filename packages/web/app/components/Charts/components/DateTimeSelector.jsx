import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';
import { addDays, format, parseISO, startOfDay } from 'date-fns';

import { DateInput as DateInputComponent, SelectInput as SelectInputComponent } from '../../Field';
import { Y_AXIS_WIDTH } from '../constants';

const Wrapper = styled.div`
  display: flex;
  gap: 24px;
  padding-left: ${Y_AXIS_WIDTH}px;
  padding-bottom: 16px;
`;

const SelectInput = styled(SelectInputComponent)`
  width: 158px;
`;

const DateInput = styled(DateInputComponent)`
  width: 158px;
`;

const CUSTOM_DATE = 'Custom Date';
export const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
const DATE_FORMAT = 'yyyy-MM-dd';

const options = [
  {
    value: 'Last 24 hours',
    label: 'Last 24 hours',
    getDefaultStartDate: () => addDays(new Date(), -1),
  },
  {
    value: 'Last 48 hours',
    label: 'Last 48 hours',
    getDefaultStartDate: () => addDays(new Date(), -2),
  },
  {
    value: CUSTOM_DATE,
    label: 'Custom Date',
    getDefaultStartDate: () => startOfDay(new Date()),
    getDefaultEndDate: () => startOfDay(addDays(new Date(), 1)),
  },
];

export const DateTimeSelector = props => {
  const { dateRange, setDateRange } = props;
  const [startDateString] = dateRange;
  const [value, setValue] = useState(options[0].value);

  const formatAndSetDateRange = useCallback(
    (newStartDate, newEndDate) => {
      const newStartDateString = format(newStartDate, DATE_TIME_FORMAT);
      const newEndDateString = format(newEndDate, DATE_TIME_FORMAT);
      setDateRange([newStartDateString, newEndDateString]);
    },
    [setDateRange],
  );

  useEffect(() => {
    const { getDefaultStartDate, getDefaultEndDate } = options.find(
      option => option.value === value,
    );
    const newStartDate = getDefaultStartDate ? getDefaultStartDate() : new Date();
    const newEndDate = getDefaultEndDate ? getDefaultEndDate() : new Date();

    formatAndSetDateRange(newStartDate, newEndDate);
  }, [value, formatAndSetDateRange]);

  return (
    <Wrapper>
      <SelectInput
        options={options}
        value={value}
        isClearable={false}
        onChange={v => {
          setValue(v.target.value);
        }}
        size="small"
      />
      {value === CUSTOM_DATE && (
        <DateInput
          size="small"
          saveDateAsString
          format={DATE_FORMAT} // set format so we can safely use parseISO
          value={startDateString}
          onChange={debounce(newValue => {
            const { value: dateString } = newValue.target;
            if (dateString) {
              const selectedDayDate = parseISO(dateString);
              const startOfDayDate = startOfDay(selectedDayDate);
              const endOfDayDate = startOfDay(addDays(selectedDayDate, 1));

              formatAndSetDateRange(startOfDayDate, endOfDayDate);
            }
          }, 200)}
          arrows
        />
      )}
    </Wrapper>
  );
};
