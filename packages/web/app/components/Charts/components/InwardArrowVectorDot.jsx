import React from 'react';
import { Colors } from '../../../constants';
import { getHeightPerYAxisInterval } from '../helpers/getHeightPerYAxisInterval';

export const InwardArrowVectorDot = props => {
  // cx, cy is the position of the current dot
  const { cx, cy, payload, active, tableHeight } = props;
  if (!payload || !tableHeight) {
    return null;
  }

  const centerPoint = { x: 6, y: 7 };
  const x = cx ? cx - centerPoint.x : 0;
  const y = cy ? cy - centerPoint.y : 0;

  const { inwardArrowVector, visualisationConfig } = payload;
  const { top, bottom } = inwardArrowVector;
  const { yAxis } = visualisationConfig;
  const { interval, graphRange } = yAxis;

  const clampedTop = Math.min(top, graphRange.max);
  const clampedBottom = Math.max(bottom, graphRange.min);
  const heightPerInterval = getHeightPerYAxisInterval(yAxis, tableHeight);
  const vectorHeight = ((clampedTop - clampedBottom) / interval) * heightPerInterval;
  const clampedVectorHeight = Math.min(vectorHeight, tableHeight);

  const verticalLine = {
    bottom: { x: 6, y: 7.5 + clampedVectorHeight },
  };
  const startAndEndPointOfBottomInwardArrow = {
    y: verticalLine.bottom.y + 6,
  };
  return (
    <svg
      x={x}
      y={y}
      width="12"
      height={startAndEndPointOfBottomInwardArrow.y + 2}
      viewBox={`0 0 12 ${startAndEndPointOfBottomInwardArrow.y + 2}`}
      fill="none"
    >
      <path
        d={`M1 1L${centerPoint.x} ${centerPoint.y}L11 1M6 7V${verticalLine.bottom.y}M1 ${startAndEndPointOfBottomInwardArrow.y}L${verticalLine.bottom.x} ${verticalLine.bottom.y}L11 ${startAndEndPointOfBottomInwardArrow.y}`}
        stroke={active ? Colors.midText : Colors.darkestText}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
