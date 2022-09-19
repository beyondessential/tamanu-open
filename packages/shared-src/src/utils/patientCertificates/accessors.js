import { format } from 'date-fns';
import { getDisplayDate } from './getDisplayDate';

export const getCompletedDate = ({ completedDate }, getLocalisation) =>
  completedDate ? getDisplayDate(completedDate, 'Do MMM YYYY', getLocalisation) : 'Unknown';

export const getDateOfSwab = ({ sampleTime }) =>
  sampleTime ? format(new Date(sampleTime), 'do MMM yyyy') : 'Unknown';

export const getTimeOfSwab = ({ sampleTime }) => {
  return sampleTime ? format(new Date(sampleTime), 'hh:mm a') : 'Unknown';
};

export const getDOB = ({ dateOfBirth }, getLocalisation) =>
  dateOfBirth ? getDisplayDate(dateOfBirth, 'Do MMM YYYY', getLocalisation) : 'Unknown';

export const getLaboratory = ({ laboratory }, getLocalisation) =>
  (laboratory || {}).name || getLocalisation('templates.covidTestCertificate.laboratoryName');

export const getLabMethod = ({ labTestMethod }) => (labTestMethod || {}).name || 'Unknown';

export const getRequestId = ({ displayId }) => displayId || 'Unknown';

export const getPlaceOfBirth = ({ additionalData }) => (additionalData || {}).placeOfBirth;

export const getNationality = ({ additionalData }) => ((additionalData || {}).nationality || {}).name;

export const getPassportNumber = ({ additionalData }) => (additionalData || {}).passport;
