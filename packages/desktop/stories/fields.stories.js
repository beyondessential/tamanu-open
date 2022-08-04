import React from 'react';
import shortid from 'shortid';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import '@fortawesome/fontawesome-free/css/all.css';
import MuiDialog from '@material-ui/core/Dialog';
import {
  TextInput,
  CheckInput,
  RadioInput,
  DateInput,
  TimeInput,
  DateTimeInput,
  NumberInput,
  SelectInput,
  MultiselectInput,
  AutocompleteInput,
  NullableBooleanInput,
  TimeWithUnitInput,
} from '../app/components';
import Box from '@material-ui/core/Box';
import { IdInput } from '../app/components/Field/IdField';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

const FRUITS = [
  { value: 'apples', label: 'Apples' },
  { value: 'oranges', label: 'Oranges' },
  { value: 'bananas', label: 'Bananas' },
  { value: 'pomegranates', label: 'Pomegranates' },
  { value: 'durian', label: 'Durian' },
  { value: 'dragonfruit', label: 'Dragonfruit' },
  { value: 'tomatoes', label: 'Tomatoes' },
  { value: 'cherries', label: 'Cherries' },
];

const Container = styled.div`
  padding: 1rem;
  max-width: 500px;
`;

// All Input components are hardcoded to be bound to a containing state
// (ie, if they're just used without value/onChange parameters they will
// behave as read-only). This component creates that containing state
// so we don't have to do it individually for each item.
class StoryControlWrapper extends React.PureComponent {
  state = { value: null };

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      this.setState({ value });
    }
  }

  onChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    action('change')(value);
    this.setState({ value });
  };

  render() {
    const { Component, clearButton, ...props } = this.props;
    const { value } = this.state;
    return (
      <Container>
        <Component {...props} value={value} onChange={this.onChange} />
        {clearButton && (
          <Button onClick={() => this.setState({ value: '' })}> Clear Field (value = "") </Button>
        )}
      </Container>
    );
  }
}

// Helper function to add a bunch of standard variants for a given control.
// Returns the chain so additional variants can be added easily when necessary.
function addStories(name, Component, note) {
  return storiesOf(`FormControls/${name}`, module)
    .addParameters({ note })
    .add('Default', () => <Component />)
    .add('Required', () => <Component required />)
    .add('Disabled', () => <Component disabled />)
    .add('With help text', () => <Component helperText="Here is some help text" />)
    .add('With error', () => <Component error helperText="Here is an error message" />)
    .add('Clearable', () => <Component clearButton />);
}

addStories(
  'TextInput',
  props => <StoryControlWrapper Component={TextInput} label="Label Name" {...props} />,
  'Free text input.',
).add('Multiline', () => (
  <StoryControlWrapper Component={TextInput} label="Life story" multiline rows={4} />
));

addStories('TimeWithUnitInput', props => (
  <StoryControlWrapper
    Component={TimeWithUnitInput}
    label="Time between onset"
    name="onsetMinutes"
    min={0}
    {...props}
  />
));

addStories('CheckInput', props => (
  <StoryControlWrapper Component={CheckInput} label="Enable" {...props} />
));

addStories('NullableBooleanInput', props => (
  <StoryControlWrapper Component={NullableBooleanInput} label="Enable" {...props} />
));

addStories('DateInput', props => (
  <StoryControlWrapper Component={DateInput} label="Date of birth" {...props} />
)).add('With prefilled date', props => (
  <StoryControlWrapper
    Component={DateInput}
    label="Prefilled"
    value="2019-10-04T08:30:56.200Z"
    {...props}
  />
));

addStories('DateTimeInput', props => (
  <StoryControlWrapper Component={DateTimeInput} label="Sample taken" {...props} />
)).add('With prefilled date', props => (
  <StoryControlWrapper
    Component={DateTimeInput}
    label="Prefilled"
    value="2019-10-04T08:30:56.200Z"
    {...props}
  />
));

addStories('TimeInput', props => (
  <StoryControlWrapper Component={TimeInput} label="Time" {...props} />
)).add('With prefilled time', props => (
  <StoryControlWrapper
    Component={TimeInput}
    label="Prefilled"
    value="2019-10-04T08:30:56.200Z"
    {...props}
  />
));

addStories('NumberInput', props => (
  <StoryControlWrapper Component={NumberInput} label="Amount" {...props} />
)).add('With limited range', () => (
  <StoryControlWrapper
    Component={NumberInput}
    label="How many fingers am I holding up?"
    min={0}
    max={10}
  />
));

addStories(
  'RadioInput',
  props => (
    <StoryControlWrapper
      Component={RadioInput}
      label="Fruit"
      options={FRUITS.slice(0, 3)}
      {...props}
    />
  ),
  "Should only be used for <=5 items. If there're a lot, prefer a SelectInput instead.",
);

addStories('SelectInput', props => (
  <StoryControlWrapper Component={SelectInput} label="Fruit" options={FRUITS} {...props} />
));

addStories('MultiselectInput', props => (
  <StoryControlWrapper Component={MultiselectInput} label="Fruit" options={FRUITS} {...props} />
));

const dummySuggester = {
  fetchSuggestions: async search => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return FRUITS.filter(x => x.label.toLowerCase().includes(search.toLowerCase()));
  },
  fetchCurrentOption: async value => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return FRUITS.find(x => x.value === value);
  },
};

addStories('Autocomplete', props => (
  <StoryControlWrapper Component={AutocompleteInput} label="Fruit" options={FRUITS} {...props} />
))
  .add('Asynchronous options', () => (
    <StoryControlWrapper Component={AutocompleteInput} label="Fruit" suggester={dummySuggester} />
  ))
  .add('Async with existing value', () => (
    <StoryControlWrapper
      Component={AutocompleteInput}
      value="pomegranates"
      label="Fruit"
      suggester={dummySuggester}
    />
  ))
  .add('Inside a Modal', props => (
    <MuiDialog width="md" open title="Autocomplete">
      <Box p={5}>
        <AutocompleteInput label="Fruit" options={FRUITS} {...props} />
      </Box>
    </MuiDialog>
  ))

  .add(
    'Async with invalid existing value',
    () => (
      <StoryControlWrapper
        Component={AutocompleteInput}
        value="not a fruit"
        label="Fruit"
        suggester={dummySuggester}
      />
    ),
    {
      note: `
    When the server responds informing the control that it's current value
    is invalid, it will dispatch an onChange event setting its value to null.
  `,
    },
  );

addStories('IdInput', props => (
  <StoryControlWrapper Component={IdInput} regenerateId={shortid.generate} {...props} />
));
