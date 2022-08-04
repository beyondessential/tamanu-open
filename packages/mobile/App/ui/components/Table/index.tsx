import React, { FunctionComponent } from 'react';
import { StyledView, RowView } from '/styled/common';
import { ScrollView } from 'react-native-gesture-handler';

export type Row = {
  rowKey: string;
  rowTitle: string;
  rowHeader: () => Element;
  cell: (cellContent: FunctionComponent<any>) => Element;
};

interface TableProps {
  Title: FunctionComponent<any>;
  cells: {};
  rows: Row[];
  columns: string[];
  tableHeader: any;
  onPressItem?: (item: any) => void;
}

export const Table = ({
  Title,
  rows,
  columns,
  cells,
  tableHeader,
  onPressItem,
}: TableProps): JSX.Element => (
  <RowView>
    <StyledView>
      <Title />
      {rows.map(r => r.rowHeader())}
    </StyledView>
    <ScrollView
      bounces={false}
      scrollEnabled
      showsHorizontalScrollIndicator
      horizontal
    >
      <RowView>
        {columns.map((column: any) => (
          <StyledView key={`${column}`}>
            {tableHeader.accessor(column, onPressItem)}
            {cells[column]
            && rows.map(row => row.cell(cells[column].find(c => c[row.rowKey] === row.rowTitle)))}
          </StyledView>
        ))}
      </RowView>
    </ScrollView>
  </RowView>
);
