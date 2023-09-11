import { REPORT_STATUSES, REPORT_DATE_RANGE_LABELS } from 'shared/constants';
import * as reportUtils from 'shared/reports';
import { canRunStaticReport } from './canRunStaticReport';

const getStaticReports = async (ability, models) => {
  const permittedReports = [];
  for (const reportDef of reportUtils.REPORT_DEFINITIONS) {
    const reportModule = await reportUtils.getReportModule(reportDef.id, models);
    if (canRunStaticReport(ability, reportDef.id, reportModule.permission)) {
      permittedReports.push(reportDef);
    }
  }
  return permittedReports.map(r => ({ ...r, legacyReport: true }));
};

const getDbReports = async (ability, models) => {
  const { ReportDefinition, ReportDefinitionVersion } = models;
  const reportDefinitions = await ReportDefinition.findAll({
    include: [
      {
        model: ReportDefinitionVersion,
        as: 'versions',
        where: { status: REPORT_STATUSES.PUBLISHED },
      },
    ],
    order: [['versions', 'version_number', 'DESC']],
  });
  const permittedReportDefinitions = reportDefinitions.filter(rd => ability.can('run', rd));

  return permittedReportDefinitions.map(r => {
    // Get the latest report definition version by getting the first record from the ordered list
    const version = r.versions[0];

    return {
      id: version.id,
      name: r.name,
      dataSourceOptions: version.queryOptions.dataSources,
      filterDateRangeAsStrings: true,
      dateRangeLabel:
        version.queryOptions.dateRangeLabel ||
        REPORT_DATE_RANGE_LABELS[version.queryOptions.defaultDateRange],
      parameters: version.getParameters(),
      version: version.versionNumber,
    };
  });
};

const getDisabledReportIds = async (models, userId) => {
  const { UserLocalisationCache } = models;
  const localisation = await UserLocalisationCache.getLocalisation({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });
  return localisation?.disabledReports || [];
};

export const getAvailableReports = async (ability, models, userId) => {
  const permittedReports = [
    ...(await getStaticReports(ability, models)),
    ...(await getDbReports(ability, models)),
  ];
  const disabledReportIds = await getDisabledReportIds(models, userId);
  const enabledReports = permittedReports.filter(({ id }) => !disabledReportIds.includes(id));
  return enabledReports;
};
