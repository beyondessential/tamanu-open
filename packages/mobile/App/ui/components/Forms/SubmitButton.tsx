import React, { useCallback, useState, ReactElement } from 'react';
import { useFormikContext } from 'formik';
import { theme } from '/styled/theme';
import { Button, StyledButtonProps } from '/components/Button';
import { TranslatedText } from '/components/Translations/TranslatedText';

interface SubmitButtonProps extends StyledButtonProps {
  onSubmit?: () => Promise<void>;
}

export const SubmitButton = ({ onSubmit, ...props }: SubmitButtonProps): ReactElement => {
  const { submitForm } = useFormikContext();
  const [isLoading, setIsLoading] = useState(false);
  const handleOnPress = useCallback(async () => {
    setIsLoading(true);
    try {
      if (typeof onSubmit === 'function') {
        await onSubmit();
      } else if (typeof submitForm === 'function') {
        await submitForm();
      }
    } finally {
      setIsLoading(false);
    }
  }, [onSubmit, submitForm]);
  return (
    <Button
      onPress={handleOnPress}
      loadingAction={isLoading}
      buttonText={<TranslatedText stringId="general.action.submit" fallback="Submit" />}
      backgroundColor={theme.colors.PRIMARY_MAIN}
      {...props}
    />
  );
};
