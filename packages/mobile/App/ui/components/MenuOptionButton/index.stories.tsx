import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { CenterView } from '/styled/common';
import {
  BaseStory,
  MoreMenuOptions,
  PatientDetails,
  ProgramOptions,
} from './fixture';

storiesOf('MenuOptionButton', module)
  .addDecorator((story: Function) => <CenterView>{story()}</CenterView>)
  .add('Level one More Menu', () => <BaseStory data={MoreMenuOptions} />)
  .add('patient Details', () => <BaseStory data={PatientDetails} />)
  .add('Programs', () => <BaseStory data={ProgramOptions} />);
