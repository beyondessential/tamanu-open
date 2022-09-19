import React from 'react';
import { storiesOf } from '@storybook/react';
import Box from '@material-ui/core/Box';
import { DateDisplay } from '../app/components/DateDisplay';

const testDate = new Date();

storiesOf('DateDisplay', module)
  .addParameters({
    note:
      'Shows a JS date in a locale-appropriate format. User can hover to see a more verbose date.',
  })
  .add('Examples', () => (
    <Box p={5}>
      <Box mb={5}>
        <span>Date: </span>
        <DateDisplay date={testDate} />
      </Box>
      <Box mb={5}>
        <span>Date & Time: </span>
        <DateDisplay date={testDate} showTime />
      </Box>
      <Box mb={5}>
        <span>Explicit Date: </span>
        <DateDisplay date={testDate} showDate={false} showExplicitDate />
      </Box>
      <Box mb={5}>
        <span>Raw Format: </span>
        <span>{DateDisplay.rawFormat(testDate)}</span>
      </Box>
    </Box>
  ));
