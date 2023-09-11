import React from 'react';
import styled from 'styled-components';
import { getComponentForQuestionType, getConfigObject, mapOptionsToValues } from '../../utils';
import { Field } from '../Field';

const Text = styled.div`
  margin-bottom: 10px;
`;

export const SurveyQuestion = ({ component, patient, inputRef }) => {
  const {
    dataElement,
    detail,
    config: componentConfig,
    options: componentOptions,
    text: componentText,
    validationCriteria,
  } = component;
  const { defaultText, type, defaultOptions, id } = dataElement;
  const configObject = getConfigObject(id, componentConfig);
  const text = componentText || defaultText;
  const options = mapOptionsToValues(componentOptions || defaultOptions);
  const FieldComponent = getComponentForQuestionType(type, configObject);

  const validationCriteriaObject = getConfigObject(id, validationCriteria);
  const required = validationCriteriaObject?.mandatory || null;

  if (!FieldComponent) return <Text>{text}</Text>;

  return (
    <Field
      inputRef={inputRef}
      label={text}
      component={FieldComponent}
      patient={patient}
      name={id}
      options={options}
      config={configObject}
      helperText={detail}
      required={required}
    />
  );
};
