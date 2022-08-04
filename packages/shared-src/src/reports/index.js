import * as admissions from './admissions';
import * as incompleteReferrals from './incomplete-referrals';
import * as recentDiagnoses from './recent-diagnoses';
import * as vaccineList from './vaccine-list';
import * as tuvaluVaccineList from './tuvalu-vaccine-list';
import * as covidVaccineList from './covid-module/covid-vaccine-list';
import * as covidVaccineDailySummaryByVillage from './covid-module/covid-vaccine-daily-summary-village';
import {
  generateCovidVaccineSummaryDose1Report,
  generateCovidVaccineSummaryDose2Report,
  permission as covidVaccineSummaryPermission,
} from './covid-module/covid-vaccine-summary';
import * as aefi from './aefi';
import * as samoaAefi from './samoa-aefi';
import * as numberPatientsRegisteredByDate from './number-patients-registered-by-date';
import * as registeredPatients from './registered-patients';
import * as fijiCovidSwabLabTestList from './covid-module/fiji/fiji-covid-swab-lab-test-list';
import * as fijiTravellerCovidLabTestList from './covid-module/fiji/fiji-traveller-covid-lab-test-list';
import * as palauCovidSwabLabTestList from './covid-module/palau/palau-covid-swab-lab-test-list';
import * as nauruCovidSwabLabTestList from './covid-module/nauru/nauru-covid-swab-lab-test-list';
import * as kiribatiCovidSwabLabTestList from './covid-module/kiribati/kiribati-covid-swab-lab-test-list';
import * as samoaCovidSwabLabTestList from './covid-module/samoa/samoa-covid-swab-lab-test-list';
import * as covidSwabLabTestsSummary from './covid-module/covid-swab-lab-tests-summary';
import * as indiaAssistiveTechnologyDeviceLineList from './india-assistive-technology-device-line-list';
import * as iraqAssistiveTechnologyDeviceLineList from './iraq-assistive-technology-device-line-list';
import * as pngAssistiveTechnologyDeviceLineList from './png-assistive-technology-device-line-list';
import * as fijiAspenEncounterSummaryLineList from './fiji-aspen-encounter-summary-line-list';
import * as fijiRecentAttendanceList from './fiji-recent-attendance-list';
import * as fijiNcdPrimaryScreeningLineList from './fiji-ncd-primary-screening/fiji-ncd-primary-screening-line-list';
import * as fijiNcdPrimaryScreeningPendingReferralsLineList from './fiji-ncd-primary-screening/fiji-ncd-primary-screening-pending-referrals-line-list';
import * as fijiNcdPrimaryScreeningSummary from './fiji-ncd-primary-screening/fiji-ncd-primary-screening-summary';
import * as fijiStatisticalReportForPhisSummary from './fiji-statistical-report-for-phis-summary';
import * as palauCovidCaseReportLineList from './covid-module/palau/palau-covid-case-report-line-list';
import * as genericSurveyExportLineList from './generic-survey-export-line-list';

export function getReportModule(reportType) {
  switch (reportType) {
    default:
      return null;
    case 'admissions':
      return admissions;
    case 'incomplete-referrals':
      return incompleteReferrals;
    case 'recent-diagnoses':
      return recentDiagnoses;
    case 'vaccine-list':
      return vaccineList;
    case 'tuvalu-vaccine-list':
      return tuvaluVaccineList;
    case 'covid-vaccine-list':
      return covidVaccineList;
    case 'covid-vaccine-daily-summary-village':
      return covidVaccineDailySummaryByVillage;
    case 'covid-vaccine-summary-dose1':
      return {
        permission: covidVaccineSummaryPermission,
        dataGenerator: generateCovidVaccineSummaryDose1Report,
      };
    case 'covid-vaccine-summary-dose2':
      return {
        permission: covidVaccineSummaryPermission,
        dataGenerator: generateCovidVaccineSummaryDose2Report,
      };
    case 'aefi':
      return aefi;
    case 'samoa-aefi':
      return samoaAefi;
    case 'number-patients-registered-by-date':
      return numberPatientsRegisteredByDate;
    case 'registered-patients':
      return registeredPatients;
    case 'fiji-covid-swab-lab-test-list':
      return fijiCovidSwabLabTestList;
    case 'fiji-traveller-covid-lab-test-list':
      return fijiTravellerCovidLabTestList;
    case 'palau-covid-swab-lab-test-list':
      return palauCovidSwabLabTestList;
    case 'nauru-covid-swab-lab-test-list':
      return nauruCovidSwabLabTestList;
    case 'kiribati-covid-swab-lab-test-list':
      return kiribatiCovidSwabLabTestList;
    case 'samoa-covid-swab-lab-test-list':
      return samoaCovidSwabLabTestList;
    case 'covid-swab-lab-tests-summary':
      return covidSwabLabTestsSummary;
    case 'india-assistive-technology-device-line-list':
      return indiaAssistiveTechnologyDeviceLineList;
    case 'iraq-assistive-technology-device-line-list':
      return iraqAssistiveTechnologyDeviceLineList;
    case 'png-assistive-technology-device-line-list':
      return pngAssistiveTechnologyDeviceLineList;
    case 'fiji-aspen-encounter-summary-line-list':
      return fijiAspenEncounterSummaryLineList;
    case 'fiji-recent-attendance-list':
      return fijiRecentAttendanceList;
    case 'fiji-ncd-primary-screening-line-list':
      return fijiNcdPrimaryScreeningLineList;
    case 'fiji-ncd-primary-screening-pending-referrals-line-list':
      return fijiNcdPrimaryScreeningPendingReferralsLineList;
    case 'fiji-ncd-primary-screening-summary':
      return fijiNcdPrimaryScreeningSummary;
    case 'fiji-statistical-report-for-phis-summary':
      return fijiStatisticalReportForPhisSummary;
    case 'palau-covid-case-report-line-list':
      return palauCovidCaseReportLineList;
    case 'generic-survey-export-line-list':
      return genericSurveyExportLineList;
  }
}

export { REPORT_DEFINITIONS } from './reportDefinitions';
export { REPORT_OBJECTS } from './reportObjects';
