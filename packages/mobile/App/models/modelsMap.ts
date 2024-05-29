import { TranslatedString } from './TranslatedString';
import { ReferenceData } from './ReferenceData';
import { ReferenceDataRelation } from './ReferenceDataRelation';
import { Patient } from './Patient';
import { PatientAdditionalData } from './PatientAdditionalData';
import { PatientFieldValue } from './PatientFieldValue';
import { PatientFieldDefinition } from './PatientFieldDefinition';
import { PatientFieldDefinitionCategory } from './PatientFieldDefinitionCategory';
import { PatientIssue } from './PatientIssue';
import { PatientSecondaryId } from './PatientSecondaryId';
import { PatientContact } from './PatientContact';
import { User } from './User';
import { Encounter } from './Encounter';
import { EncounterHistory } from './EncounterHistory';
import { Program } from './Program';
import { ProgramRegistry } from './ProgramRegistry';
import { ProgramRegistryCondition } from './ProgramRegistryCondition';
import { PatientProgramRegistration } from './PatientProgramRegistration';
import { PatientProgramRegistrationCondition } from './PatientProgramRegistrationCondition';
import { ProgramRegistryClinicalStatus } from './ProgramRegistryClinicalStatus';
import { ProgramDataElement } from './ProgramDataElement';
import { Survey } from './Survey';
import { SurveyScreenComponent } from './SurveyScreenComponent';
import { SurveyResponse } from './SurveyResponse';
import { SurveyResponseAnswer } from './SurveyResponseAnswer';
import { Vitals } from './Vitals';
import { Diagnosis } from './Diagnosis';
import { ScheduledVaccine } from './ScheduledVaccine';
import { AdministeredVaccine } from './AdministeredVaccine';
import { Referral } from './Referral';
import { Medication } from './Medication';
import { Attachment } from './Attachment';
import { Facility } from './Facility';
import { Department } from './Department';
import { Location } from './Location';
import { LocationGroup } from './LocationGroup';
import { BaseModel } from './BaseModel';
import { LabRequest } from './LabRequest';
import { LabTest } from './LabTest';
import { LabTestType } from './LabTestType';
import { LabTestPanelRequest } from './LabTestPanelRequest';
import { LabTestPanel } from './LabTestPanel';
import { LocalSystemFact } from './LocalSystemFact';
import { PatientFacility } from './PatientFacility';
import { Setting } from './Setting';
import { LegacyNotePage } from './LegacyNotePage';
import { LegacyNoteItem } from './LegacyNoteItem';
import { Note } from './Note';
import { VitalLog } from './VitalLog';

export const MODELS_MAP = {
  ReferenceData,
  TranslatedString,
  Patient,
  PatientAdditionalData,
  PatientFieldDefinitionCategory,
  PatientFieldDefinition,
  PatientFieldValue,
  PatientIssue,
  PatientSecondaryId,
  PatientContact,
  User,
  Encounter,
  EncounterHistory,
  Program,
  ProgramRegistry,
  ProgramRegistryCondition,
  PatientProgramRegistration,
  PatientProgramRegistrationCondition,
  ProgramRegistryClinicalStatus,
  ReferenceDataRelation,
  ProgramDataElement,
  Survey,
  SurveyScreenComponent,
  SurveyResponse,
  SurveyResponseAnswer,
  VitalLog,
  Vitals,
  Diagnosis,
  ScheduledVaccine,
  AdministeredVaccine,
  Medication,
  Referral,
  Attachment,
  Facility,
  Department,
  Location,
  LocationGroup,
  LabRequest,
  LabTest,
  LabTestType,
  LabTestPanel,
  LabTestPanelRequest,
  LocalSystemFact,
  PatientFacility,
  Setting,
  LegacyNotePage,
  LegacyNoteItem,
  Note,
};
export const MODELS_ARRAY: typeof BaseModel[] = Object.values(MODELS_MAP);
