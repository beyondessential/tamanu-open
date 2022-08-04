import React, { useCallback } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

// Button has 'text-transform: uppercase' by default,
// override and uppercase only the first one
const TextTransformedButton = styled(Button)`
  text-transform: none;

  &::first-letter {
    text-transform: uppercase;
  }
`;

// mostly cribbed from the mui example at https://material-ui.com/components/buttons/#split-button

export const DropdownButton = React.memo(({ actions, color, dropdownColor, variant, ...props }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  function handleClick(event, index) {
    setOpen(false);
    actions[index].onClick(event);
  }

  const handleToggle = useCallback(() => {
    setOpen(prevOpen => !prevOpen);
  }, []);

  const handleClose = useCallback(event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  }, []);

  const [mainAction, ...otherActions] = actions;

  if (!mainAction) {
    return (
      <TextTransformedButton {...props} variant={variant} color={color} disabled>
        No action
      </TextTransformedButton>
    );
  }

  if (otherActions.length === 0) {
    return (
      <TextTransformedButton
        {...props}
        variant={variant}
        color={color}
        onClick={event => handleClick(event, 0)}
      >
        {mainAction.label}
      </TextTransformedButton>
    );
  }

  return (
    <span {...props}>
      <ButtonGroup variant={variant} color={color} ref={anchorRef} aria-label="split button">
        <TextTransformedButton onClick={event => handleClick(event, 0)}>
          {mainAction.label}
        </TextTransformedButton>
        <TextTransformedButton
          color={dropdownColor || color}
          size="small"
          aria-owns={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </TextTransformedButton>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        transition
        disablePortal
        style={{ zIndex: 10 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper id="menu-list-grow">
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  {otherActions.map((action, index) => (
                    <MenuItem
                      key={action.label}
                      disabled={!action.onClick}
                      onClick={event => handleClick(event, index + 1)}
                    >
                      {action.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </span>
  );
});

export const FullWidthDropdownButton = styled(DropdownButton)`
  width: 100%; /* targets single action button */

  div:first-of-type {
    /* targets dropdown button container, ignoring actions container */
    width: 100%;

    button:first-of-type {
      /* targets action button, ignoring dropdown button */
      width: 100%;
    }
  }
`;
