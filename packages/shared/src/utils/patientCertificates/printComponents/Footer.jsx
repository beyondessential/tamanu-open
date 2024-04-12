import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { formatShort, getCurrentDateString } from '../../dateTime';

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: 25,
    left: 50,
    right: 50,
    color: '#888888',
    borderTop: '1px solid #888888',
    paddingTop: 2,
  },

  footerLeftContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  footerRightContent: {
    flexDirection: 'row',
    textAlign: 'right',
  },

  labelText: {
    fontSize: 8,
    fontWeight: 400,
    fontFamily: 'Helvetica-Bold',
  },

  valueText: {
    fontSize: 8,
    fontWeight: 400,
    fontFamily: 'Helvetica',
  },
});

const LabelText = ({ children, props }) => (
  <Text style={styles.labelText} {...props}>
    {children}
  </Text>
);

const ValueText = ({ children, props }) => (
  <Text style={styles.valueText} {...props}>
    {children}
  </Text>
);

export const Footer = ({ printDate, printFacility, printedBy, style }) => {
  return (
    <View style={[styles.footer, style]} fixed>
      <View style={styles.footerLeftContent}>
        <LabelText>Print date: </LabelText>
        <ValueText>{formatShort(printDate || getCurrentDateString())}</ValueText>
        {printFacility && (
          <>
            <ValueText> | </ValueText>
            <LabelText>Print facility: </LabelText>
            <ValueText>{printFacility}</ValueText>
          </>
        )}
        {printedBy && (
          <>
            <ValueText> | </ValueText>
            <LabelText>Printed by: </LabelText>
            <ValueText>{printedBy}</ValueText>
          </>
        )}
      </View>
      <View style={styles.footerRightContent}>
        <Text
          style={styles.valueText}
          render={({ pageNumber, totalPages }) => `${pageNumber} of ${totalPages}`}
        />
      </View>
    </View>
  );
};
