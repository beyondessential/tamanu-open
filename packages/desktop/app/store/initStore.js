import { createHashHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { persistCombineReducers } from 'redux-persist';

import { authReducer } from './auth';
import { optionsReducer } from './options';
import { imagingRequestReducer } from './imagingRequest';
import { patientReducer } from './patient';
import { specialModalsReducer } from './specialModals';

export const createReducers = history => ({
  router: connectRouter(history),
  auth: authReducer,
  patient: patientReducer,
  options: optionsReducer,
  imagingRequest: imagingRequestReducer,
  specialModals: specialModalsReducer,
});

export function initStore(api) {
  const history = createHashHistory();
  const router = routerMiddleware(history);
  const enhancers = compose(applyMiddleware(router, thunk.withExtraArgument({ api })));
  const persistConfig = { key: 'tamanu', storage };
  if (process.env.NODE_ENV !== 'development') {
    persistConfig.whitelist = []; // persist used for a dev experience, but not required in production
  }
  const persistedReducers = persistCombineReducers(persistConfig, createReducers(history));
  const store = createStore(persistedReducers, {}, enhancers);

  api.setReduxStore(store);
  
  return { store, history };
}
