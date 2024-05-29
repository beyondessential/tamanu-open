import React from 'react';
import styled from 'styled-components';
import { LanguageSelector } from '../../app/components/LanguageSelector';
import { ApiContext } from '../../app/api/index.js';
import { TranslationProvider } from '../../app/contexts/Translation';

const exampleOptions = [
  {
    label: '🇬🇧 English',
    value: 'en',
  },
  {
    label: '🇰🇭 ភាសាខ្មែរ',
    value: 'km',
  },
];

const multipleLanguageApi = {
  get: async () => {
    return exampleOptions;
  },
};

const singleLanguageApi = {
  get: async () => {
    return exampleOptions.slice(1);
  },
};

const noLanguageApi = {
  get: async () => {
    return [];
  },
};

const Container = styled.div`
  padding: 1rem;
  height: 80px;
  max-width: 500px;
  position: relative;
`;

export default {
  title: 'Translation/LanguageSelector',
  component: LanguageSelector,
  decorators: [
    Story => (
      <TranslationProvider>
        <Container>
          <Story />
        </Container>
      </TranslationProvider>
    ),
  ],
};

const Template = args => {
  const { api } = args;
  return (
    <ApiContext.Provider value={api}>
      <LanguageSelector setFieldValue={() => null} {...args} />
    </ApiContext.Provider>
  );
};

export const MultipleLanguages = Template.bind({});
MultipleLanguages.args = {
  api: multipleLanguageApi,
};

export const SingleLanguage = Template.bind({});
SingleLanguage.args = {
  api: singleLanguageApi,
};

export const NoLanguage = Template.bind({});
NoLanguage.args = {
  api: noLanguageApi,
};
