// This file is autogenerated, do not edit it directly
import { databaseSetup1661160427226 } from './1661160427226-databaseSetup';
import { updatePatientDateTimeColumns1661717539000 } from './1661717539000-updatePatientDateTimeColumns';
import { updateLabTestDate1662006885000 } from './1662006885000-updateLabTestDate';
import { updatePatientIssueDate1663564207000 } from './1663564207000-updatePatientIssueDate';
import { updatePatientEncounterDateTimeColumns1664229842000 } from './1664229842000-updatePatientEncounterDateTimeColumns';
import { alterModelsForV2Sync1663710579000 } from './1663710579000-alterModelsForV2Sync';
import { updateSurveyResponseDateTimeColumns1664475769000 } from './1664475769000-updateSurveyResponseDateTimeColumns';
import { changeCaseOfSpo21665717114000 } from './1665717114000-changeCaseOfSpo2';
import { updateLabRequestDateColumns1666171050000 } from './1666171050000-updateLabRequestDateColumns';
import { addFieldUpdateTicksToPAD1668987530000 } from './1668987530000-addFieldUpdateTicksToPAD';
import { addDefaultLastSuccessfulSyncPull1669160460000 } from './1669160460000-addDefaultLastSuccessfulSyncPull';
import { resyncPatientAdditionalData1669855692000 } from './1669855692000-resyncPatientAdditionalData';
import { wipeAllDataAndResync1675907161000 } from './1675907161000-wipeAllDataAndResync';
import { addLocationGroupTable1673396917000 } from './1673396917000-addLocationGroupTable';
import { addNoteTables1677554085000 } from './1677554085000-addNoteTables';
import { addNotGivenReasonIdColumnToAdministeredVaccineTable1678061990000 } from './1678061990000-addNotGivenReasonIdColumnToAdministeredVaccineTable';
import { addSettingTable1678400759000 } from './1678400759000-addSettingTable';
import { addConsentGivenByToAdministeredVaccine1682923186000 } from './1682923186000-addConsentGivenByToAdministeredVaccine';
import { addNewColumnsToAdministeredVaccine1683596516000 } from './1683596516000-addNewColumnsToAdministeredVaccine';
import { changeDateColumnToNullableForAdministeredVaccine1683598923000 } from './1683598923000-changeDateColumnToNullableForAdministeredVaccine';

export const migrationList = [
  databaseSetup1661160427226,
  updatePatientDateTimeColumns1661717539000,
  updateLabTestDate1662006885000,
  updatePatientIssueDate1663564207000,
  updatePatientEncounterDateTimeColumns1664229842000,
  alterModelsForV2Sync1663710579000,
  updateSurveyResponseDateTimeColumns1664475769000,
  changeCaseOfSpo21665717114000,
  updateLabRequestDateColumns1666171050000,
  addFieldUpdateTicksToPAD1668987530000,
  addDefaultLastSuccessfulSyncPull1669160460000,
  resyncPatientAdditionalData1669855692000,
  wipeAllDataAndResync1675907161000,
  addLocationGroupTable1673396917000,
  addNoteTables1677554085000,
  addNotGivenReasonIdColumnToAdministeredVaccineTable1678061990000,
  addSettingTable1678400759000,
  addConsentGivenByToAdministeredVaccine1682923186000,
  addNewColumnsToAdministeredVaccine1683596516000,
  changeDateColumnToNullableForAdministeredVaccine1683598923000,
];
