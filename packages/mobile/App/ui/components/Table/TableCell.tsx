import React, { ReactNode } from 'react';
import { StyledView } from '/styled/common';
import { theme } from '/styled/theme';

interface TableCellProps {
  children: ReactNode;
}

export const TableCell = ({ children }: TableCellProps): JSX.Element => (
  <StyledView
    height={45}
    paddingLeft={15}
    width="100%"
    justifyContent="center"
    borderBottomWidth={1}
    borderColor={theme.colors.BOX_OUTLINE}
    borderRightWidth={1}
  >
    {children}
  </StyledView>
);
