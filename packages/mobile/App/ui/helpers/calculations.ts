import { create, all as allMath } from 'mathjs';
import { ISurveyScreenComponent } from '~/types/ISurvey';

// set up math context
const math = create(allMath);

export function runCalculations(components: ISurveyScreenComponent[], values: any): any {
  const inputValues = { ...values };
  const calculatedValues = {};

  for (const c of components) {
    if (c.calculation) {
      try {
        let value = math.evaluate(c.calculation, inputValues);
        if (!Number.isFinite(value)) {
          throw new Error('Value is not a valid number');
        }
        const config = c.getConfigObject();
        if (config.rounding) {
          value = parseFloat(parseFloat(value).toFixed(config.rounding));
        }
        inputValues[c.dataElement.code] = value;
        calculatedValues[c.dataElement.code] = value;
      } catch (e) {
        calculatedValues[c.dataElement.code] = null;
      }
    }
  }

  return calculatedValues;
}
