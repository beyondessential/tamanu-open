import { push } from 'connected-react-router';

// actions
const PATIENT_LOAD_START = 'PATIENT_LOAD_START';
const PATIENT_LOAD_ERROR = 'PATIENT_LOAD_ERROR';
const PATIENT_LOAD_FINISH = 'PATIENT_LOAD_FINISH';
const PATIENT_CLEAR = 'PATIENT_CLEAR';
const PATIENT_SYNCING = 'PATIENT_SYNCING';

export const viewPatientEncounter = (patientId, modal = '') => async dispatch => {
  dispatch(reloadPatient(patientId));
  dispatch(push(modal ? `/patients/encounter/${modal}` : '/patients/encounter'));
};

export const clearPatient = () => ({
  type: PATIENT_CLEAR,
});

export const viewPatient = (id, modal = '') => async dispatch => {
  dispatch(reloadPatient(id));
  dispatch(push(`/patients/view/${modal}`));
};

export const reloadPatient = id => async (dispatch, getState, { api }) => {
  dispatch({ type: PATIENT_LOAD_START, id });

  try {
    const [
      patient,
      currentEncounter,
      familyHistory,
      allergies,
      issues,
      conditions,
      carePlans,
      additionalData,
    ] = await Promise.all([
      api.get(`patient/${id}`),
      api.get(`patient/${id}/currentEncounter`),
      api.get(`patient/${id}/familyHistory`),
      api.get(`patient/${id}/allergies`),
      api.get(`patient/${id}/issues`),
      api.get(`patient/${id}/conditions`),
      api.get(`patient/${id}/carePlans`),
      api.get(`patient/${id}/additionalData`),
    ]);

    dispatch({
      type: PATIENT_LOAD_FINISH,
      patient: {
        currentEncounter,
        issues: issues.data,
        conditions: conditions.data,
        allergies: allergies.data,
        familyHistory: familyHistory.data,
        carePlans: carePlans.data,
        additionalData,
        ...patient,
      },
    });
  } catch (e) {
    dispatch({ type: PATIENT_LOAD_ERROR, error: e });
  }
};

export const syncPatient = () => async (dispatch, getState, { api }) => {
  const { patient } = getState();
  dispatch({
    type: PATIENT_SYNCING,
    data: true,
  });
  await api.put(`patient/${patient.id}`, { markedForSync: true });
  dispatch(reloadPatient(patient.id));

  // typically it takes a while for sync to complete
  // so wait for about 30 seconds till removing syncing state
  await new Promise(resolve => setTimeout(resolve, 30000));
  dispatch({
    type: PATIENT_SYNCING,
    data: false,
  });
};

// reducers

const defaultState = {
  loading: true,
  id: null,
  error: null,
  issues: [],
};

export const patientReducer = (state = defaultState, action) => {
  switch (action.type) {
    case PATIENT_LOAD_START:
      return {
        ...state,
        loading: true,
        id: action.id,
        error: null,
        issues: [],
      };
    case PATIENT_LOAD_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case PATIENT_LOAD_FINISH:
      return {
        ...state,
        loading: false,
        error: null,
        ...action.patient,
      };
    case PATIENT_CLEAR:
      return defaultState;
    case PATIENT_SYNCING:
      return {
        ...state,
        syncing: action.data,
      };
    default:
      return state;
  }
};
