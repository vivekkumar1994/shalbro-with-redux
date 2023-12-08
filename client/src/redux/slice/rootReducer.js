// rootReducer.js
import { combineReducers } from 'redux';
import adminReducer from './adminSlice.js'; // Adjust the path if needed
import companyReducer from "./getAllCompany.js"
const rootReducer = combineReducers({
  admin: adminReducer,
  company: companyReducer,
  // Add other reducers here if you have them
});

export default rootReducer;
