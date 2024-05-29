import { Command } from 'commander';

import { log } from '@tamanu/shared/services/logging';
import { ApplicationContext } from '../ApplicationContext';

async function report({ reportId }) {
  const context = await new ApplicationContext().init({ appType: 'report' });
  // going via inline import rather than top-level just to keep diff footprint small during a hotfix
  // should be fine to pull to the top level
  const { getReportModule } = await import('@tamanu/shared/reports');

  const module = await getReportModule(reportId, context.models);
  log.info(`Running report ${reportId} (with empty parameters)`);
  const result = await module.dataGenerator(context, {});
  // console.log is fine because this command should return output
  // eslint-disable-next-line no-console
  console.log(result);
  process.exit(0);
}

export const reportCommand = new Command('report')
  .description('Generate a report')
  .requiredOption('--reportId <string>', 'Id of the report')
  .action(report);
