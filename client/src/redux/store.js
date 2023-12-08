import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';
import companyLogin from "./slice/companyLogin";
import getAllCompaniesSlice from "./slice/getAllCompany";
import getEmployee from "./slice/getEmployee";
import getAttendance from "./slice/getAttendance";
import getDocumentC from "./slice/getDocumentC";
import getSubcontractor from "./slice/getSubcontractor";
import { combineReducers } from 'redux';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist/es/constants';
import getProject from "./slice/getProjectSlice";

const persistConfig = {
  key: 'root',
  version: 1,
  storage:storageSession,
};

const persistedLoginReducer = persistReducer(persistConfig, companyLogin);



const rootReducer = combineReducers({
  companyLogin: persistedLoginReducer,
  getCompany: getAllCompaniesSlice,
  getEmployee: getEmployee,
  getProject:getProject,
  getAttendance:getAttendance,
  getDocumentC:getDocumentC,
  getSubcontractor:getSubcontractor
  // Add other reducers here if needed
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store)

