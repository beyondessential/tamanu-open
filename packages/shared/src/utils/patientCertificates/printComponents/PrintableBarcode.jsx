import React from 'react';
import { Image } from '@react-pdf/renderer';
import JsBarcode from 'jsbarcode';

export const PrintableBarcode = ({
  id,
  width = 105,
  barWidth = 1,
  barHeight = 35,
  fontSize = 13,
  margin = 0,
  barcodeStyle = {},
}) => {
  // eslint-disable-next-line no-undef
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, id, {
    width: barWidth,
    height: barHeight,
    fontSize: fontSize,
    ...barcodeStyle,
  });
  const barcode = canvas.toDataURL();

  return <Image source={barcode} style={{ width, margin }} />;
};
