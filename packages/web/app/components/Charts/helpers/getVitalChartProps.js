import { customisedXAxisLabelHeight } from '../components/CustomisedTick';
import { CHART_MARGIN, MULTI_CHARTS_VIEW_INTERVAL_HEIGHT } from '../constants';
import { getXAxisTicks, getYAxisTicks } from './axisTicks';

export const defaultTableHeight = 500;

export const getVitalChartProps = ({ visualisationConfig, dateRange, isInMultiChartsView }) => {
  const { yAxis: yAxisConfigs } = visualisationConfig;
  const margin = CHART_MARGIN;
  const xAxisTicks = getXAxisTicks(dateRange);
  const yAxisTicks = getYAxisTicks(yAxisConfigs);
  const tableHeight = isInMultiChartsView
    ? (yAxisTicks.length - 1) * MULTI_CHARTS_VIEW_INTERVAL_HEIGHT
    : defaultTableHeight;
  const height = tableHeight + customisedXAxisLabelHeight + margin.top + margin.bottom;

  return { xAxisTicks, yAxisTicks, tableHeight, height, margin };
};
