import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '~/types';

export type WithAuthStoreProps = WithAuthActions & AuthStateProps;
export interface WithAuthActions {
  setUser: (payload: IUser) => PayloadAction<IUser>;
  setToken: (payload: string) => PayloadAction<IUser>;
  setFirstSignIn: (value: boolean) => PayloadAction<boolean>;
  setSignedInStatus: (payload: boolean) => PayloadAction<boolean>;
  signOutUser(): () => PayloadAction<void>;
}

export interface AuthStateProps {
  token: string;
  user: IUser;
  signedIn: boolean;
  isFirstTime: boolean;
}

const initialState: AuthStateProps = {
  token: null,
  user: null,
  signedIn: false,
  isFirstTime: true,
};

export const PatientSlice = createSlice({
  name: 'patient',
  initialState: initialState,
  reducers: {
    setToken(state, { payload: token }: PayloadAction<string>): AuthStateProps {
      return {
        ...state,
        token,
      };
    },
    setSignedInStatus(
      state,
      { payload: signInStatus }: PayloadAction<boolean>,
    ): AuthStateProps {
      return {
        ...state,
        signedIn: signInStatus,
      };
    },
    setFirstSignIn(
      state,
      { payload: firstSignIn }: PayloadAction<boolean>,
    ): AuthStateProps {
      return {
        ...state,
        isFirstTime: firstSignIn,
      };
    },
    setUser(
      state,
      { payload: user }: PayloadAction<IUser>,
    ): AuthStateProps {
      return {
        ...state,
        user,
      };
    },
    signOutUser(state): AuthStateProps {
      return {
        ...state,
        token: null,
      };
    },
  },
});

export const actions = PatientSlice.actions;
export const authReducer = PatientSlice.reducer;
