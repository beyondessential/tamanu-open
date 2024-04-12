import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { Link } from 'react-router-dom';
import { red } from '@material-ui/core/colors';
import {
  CircularProgress,
  IconButton,
  Button as MuiButton,
  ButtonBase as MuiButtonBase,
} from '@material-ui/core';
import {
  AddBoxOutlined,
  ChevronLeft,
  IndeterminateCheckBox,
  Lock,
  Refresh,
} from '@material-ui/icons';

import { Colors } from '../constants';
import { withPermissionCheck } from './withPermissionCheck';
import { withPermissionTooltip } from './withPermissionTooltip';
import { TranslatedText } from './Translation/TranslatedText';
import { useFormButtonSubmitting } from '../hooks/useFormButtonSubmitting';

export const ButtonBase = props => {
  delete props.functionallyDisabled;
  const locationsProps = getLocationProps(props);
  return <MuiButtonBase {...props} {...locationsProps} />;
};

const StyledButton = styled(({ ...props }) => {
  delete props.functionallyDisabled;
  return <MuiButton {...props} />;
})`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-transform: none;
  padding: 11px 18px 12px 18px;
  box-shadow: none;
  min-width: 100px;

  /* Button is already disabled functionally,
  this is only to visually make it more obvious that the button is disabled */
  ${props => (props.functionallyDisabled ? 'pointer-events: none;' : '')}

  .MuiSvgIcon-root {
    width: 19.5px;
    height: auto;
    margin-right: 10px;
  }

  &.MuiButton-sizeSmall {
    padding-left: 14px;
    padding-right: 14px;
  }

  &.MuiButton-outlinedPrimary {
    border-color: ${props => props.theme.palette.primary.main};
  }
`;

const StyledCircularProgress = styled(CircularProgress)`
  margin-right: 5px;
`;

const BaseButton = ({
  children,
  isSubmitting,
  disabled,
  functionallyDisabled = false, // for disable the function of button, but still keep the visual the same
  hasPermission = true,
  loadingColor = Colors.white,
  showLoadingIndicator,
  type,
  ...props
}) => {
  const locationsProps = getLocationProps(props);
  const displayLock = !isSubmitting && !hasPermission;
  const buttonComponent = functionallyDisabled
    ? // Workaround to display a disabled button with non-disabled styling. MaterialUI doesn't
      // see the disabled prop so it won't add its own styling, but the underlying button element
      // is still disabled.
      // eslint-disable-next-line react/button-has-type
      buttonProps => <button type={type} {...buttonProps} disabled />
    : undefined;
  return (
    <StyledButton
      {...props}
      {...locationsProps}
      disabled={disabled || !hasPermission}
      type={type}
      functionallyDisabled={functionallyDisabled}
      component={buttonComponent}
    >
      {displayLock && <Lock />}
      {showLoadingIndicator && <StyledCircularProgress color={loadingColor} size={25} />}
      {!showLoadingIndicator && children}
    </StyledButton>
  );
};

export const Button = ({ isSubmitting = false, ...props }) => (
  <BaseButton
    isSubmitting={isSubmitting}
    functionallyDisabled={isSubmitting}
    showLoadingIndicator={isSubmitting}
    {...props}
  />
);

BaseButton.propTypes = {
  isSubmitting: PropTypes.bool,
  disabled: PropTypes.bool,
  variant: PropTypes.PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.PropTypes.oneOf(['default', 'primary', 'secondary']),
  type: PropTypes.PropTypes.oneOf(['button', 'submit', 'reset']),
};

BaseButton.defaultProps = {
  isSubmitting: false,
  disabled: false,
  variant: 'contained',
  color: 'primary',
  type: 'button',
};

const StyledOutlinedButton = styled(StyledButton)`
  border-color: ${props => props.theme.palette.primary.main};
  :disabled {
    border-color: ${Colors.softText};
  }
`;

export const OutlinedButton = props => (
  <StyledOutlinedButton variant="outlined" color="primary" {...props} />
);

export const GreyOutlinedButton = styled(props => <StyledButton {...props} />)`
  border: 1px solid #dedede;
  color: ${props => props.theme.palette.text.secondary};
`;

export const RedOutlinedButton = styled(props => <StyledButton {...props} />)`
  border: 1px solid ${Colors.alert};
  color: ${Colors.alert};
`;

const StyledLargeButton = styled(StyledButton)`
  font-size: 15px;
  line-height: 18px;
  padding: 12px 25px;
  border: 1px solid ${props => props.theme.palette.primary.main};
`;

export const LargeButton = props => (
  <StyledLargeButton variant="contained" color="primary" {...props} />
);

export const LargeOutlineButton = props => (
  <StyledLargeButton variant="outlined" color="primary" {...props} />
);

const StyledDeleteButton = styled(Button)`
  background: ${red[600]};
  color: ${Colors.white};

  :hover {
    background: ${red[800]};
  }
`;

export const DeleteButton = props => {
  const { children } = props;
  return (
    <StyledDeleteButton variant="contained" {...props}>
      {children || 'Delete'}
    </StyledDeleteButton>
  );
};

const StyledTextButton = styled(Button)`
  font-size: 16px;
  text-transform: capitalize;
  padding: 0;
  min-height: auto;
  min-width: auto;
  color: #5b84ad;
  :hover {
    background: rgba(0, 0, 0, 0);
    color: #23476b;
    font-weight: 500;
  }
`;

export const TextButton = ({ children, ...props }) => (
  <StyledTextButton variant="text" color="primary" {...props}>
    {children}
  </StyledTextButton>
);

const StyledNavButton = styled(TextButton)`
  color: ${Colors.primary};
  padding-right: 8px;
  font-size: 12px;
  & svg {
    font-size: 20px;
  }
`;

export const BackButton = ({ to, text = true, ...props }) => (
  <StyledNavButton to={to} {...props}>
    <ChevronLeft />
    {text && (
      <>
        {' '}
        <TranslatedText stringId="general.action.back" fallback="Back" />
      </>
    )}
  </StyledNavButton>
);

export const PlusIconButton = ({ ...props }) => (
  <IconButton color="primary" {...props}>
    <AddBoxOutlined fontSize="inherit" />
  </IconButton>
);

export const MinusIconButton = ({ ...props }) => (
  <IconButton color="primary" {...props}>
    <IndeterminateCheckBox fontSize="inherit" />
  </IconButton>
);

export const RefreshIconButton = ({ ...props }) => (
  <IconButton color="primary" {...props}>
    <Refresh fontSize="inherit" />
  </IconButton>
);

export const FormSubmitButton = ({
  children,
  text = 'Confirm',
  color = 'primary',
  onSubmit,
  ...props
}) => {
  const { isSubmitting, showLoadingIndicator } = useFormButtonSubmitting();

  return (
    <Button
      isSubmitting={isSubmitting}
      showLoadingIndicator={showLoadingIndicator}
      color={color}
      onClick={onSubmit}
      functionallyDisabled={isSubmitting}
      type="submit"
      {...props}
    >
      {children || text}
    </Button>
  );
};

export const FormCancelButton = ({ ...props }) => {
  const { isSubmitting } = useFormikContext();

  return <OutlinedButton functionallyDisabled={isSubmitting} {...props} />;
};

export const StyledPrimarySubmitButton = styled(FormSubmitButton)`
  font-size: 16px;
  line-height: 18px;
  padding-top: 16px;
  padding-bottom: 16px;
`;

const StyledLargeSubmitButton = styled(FormSubmitButton)`
  font-size: 15px;
  line-height: 18px;
  padding: 12px 25px;
  border: 1px solid ${props => props.theme.palette.primary.main};
`;

export const LargeSubmitButton = props => (
  <StyledLargeSubmitButton variant="contained" color="primary" {...props} />
);

export const LargeOutlinedSubmitButton = props => (
  <StyledLargeSubmitButton variant="outlined" color="primary" {...props} />
);

export const DefaultIconButton = styled(({ children, ...props }) => (
  <IconButton {...props}>{children}</IconButton>
))`
  border-radius: 20%;
  padding: 0px;
`;

const getLocationProps = ({ to }) => {
  if (to) {
    return { component: Link, to };
  }
  return {};
};

const ButtonWithPermissionTooltip = withPermissionTooltip(Button);
export const ButtonWithPermissionCheck = withPermissionCheck(ButtonWithPermissionTooltip);
