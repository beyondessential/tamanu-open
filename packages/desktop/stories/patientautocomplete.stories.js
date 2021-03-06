import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { createDummyPatient } from 'Shared/demoData';

import { PatientAutocomplete } from '../app/components/PatientAutocomplete';

const patients = new Array(400).fill(0).map(() => createDummyPatient());

const suggester = {
  fetchSuggestions: async search => {
    const s = search.toLowerCase();
    return patients.filter(x => x.firstName.toLowerCase().includes(s)).slice(0, 10);
  },
};

storiesOf('PatientAutocomplete', module).add('Default', () => (
  <PatientAutocomplete suggester={suggester} onPatientSelect={action('patientSelect')} />
));
