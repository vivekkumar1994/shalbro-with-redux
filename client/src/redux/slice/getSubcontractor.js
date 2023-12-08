


import { createSlice } from "@reduxjs/toolkit";

const getSubcontractorSlice = createSlice({
  name: "getSubcontractor",
  initialState: {
    rows: [],
    loading: false,
    error: null,
  },
  reducers: {
    setRowsSubcontractor: (state, action) => {
      state.rows = action.payload;
    },
    setLoadingSubcontractor: (state, action) => {
      state.loading = action.payload;
    },
    setErrorSubcontractor: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setRowsSubcontractor,
  setLoadingSubcontractor,
  setErrorSubcontractor,
} = getSubcontractorSlice.actions;

export default getSubcontractorSlice.reducer;

