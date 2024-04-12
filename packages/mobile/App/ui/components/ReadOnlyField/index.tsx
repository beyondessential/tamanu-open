import React from 'react';
import { Orientation, screenPercentageToDP } from '~/ui/helpers/screen';
import { StyledText } from '~/ui/styled/common';
import { TranslatedText } from '/components/Translations/TranslatedText';

const getValueToDisplay = value => {
  if (typeof value === 'number') return value.toFixed(1);
  if (!value) return <TranslatedText stringId="general.fallback.notApplicable" fallback="N/A" />;
  return value;
};

export const ReadOnlyField = ({ value }: { value: any }) => {
  const styleProps = {
    color: value ? '#000' : '#aaa',
    fontSize: screenPercentageToDP('2.2', Orientation.Height),
  };

  return <StyledText {...styleProps}>{getValueToDisplay(value)}</StyledText>;
};
