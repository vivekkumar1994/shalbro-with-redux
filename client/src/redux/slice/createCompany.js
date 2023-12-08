import { createSlice } from '@reduxjs/toolkit';

const companyCreateSlice = createSlice({
  name: 'company',
  initialState: {
    companies: [],
  },
  reducers: {
    companyAdded: (state, action) => {
      state.companies.push(action.payload);
    },
    // Add other reducers as needed
  },
});

export const { companyAdded } = companyCreateSlice.actions;

export default companyCreateSlice.reducer;
