import React, { ReactElement } from 'react';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

type InitialValuesProps = {
  [key: string]: any;
};

type ValidationSchema = Yup.ObjectSchema;

type onSubmit<T> = (data: T) => Promise<void>;
type FormProps<T extends InitialValuesProps> = {
  initialValues: T;
  validationSchema: ValidationSchema;
  onSubmit: onSubmit<T>;
  children: (props: FormikProps<T>) => ReactElement;
};

export function Form<T>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: FormProps<T>): ReactElement {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {children}
    </Formik>
  );
}
