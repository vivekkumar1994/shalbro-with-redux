


import { createSlice } from "@reduxjs/toolkit";

const getProjectSlice = createSlice({
  name: "getProject",
  initialState: {
    rows: [],
    loading: false,
    error: null,
  },
  reducers: {
    setRowsProject: (state, action) => {
      state.rows = action.payload;
    },
    setLoadingProject: (state, action) => {
      state.loading = action.payload;
    },
    setErrorProject: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setRowsProject,
  setLoadingProject,
  setErrorProject,
} = getProjectSlice.actions;

export default getProjectSlice.reducer;

