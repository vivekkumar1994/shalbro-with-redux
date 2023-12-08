


import { createSlice } from "@reduxjs/toolkit";

const getEmployeeSlice = createSlice({
  name: "getProject",
  initialState: {
    rows: [],
    loading: false,
    error: null,
  },
  reducers: {
    setRowsEmployee: (state, action) => {
      state.rows = action.payload;
    },
    setLoadingEmployee: (state, action) => {
      state.loading = action.payload;
    },
    setErrorEmployee: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setRowsEmployee,
  setLoadingEmployee,
  setErrorEmployee,
} = getEmployeeSlice.actions;

export default getEmployeeSlice.reducer;

