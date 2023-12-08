


import { createSlice } from "@reduxjs/toolkit";

const getDocumentCSlice = createSlice({
  name: "get",
  initialState: {
    rows: [],
    loading: false,
    error: null,
  },
  reducers: {
    setRowsDocumentC: (state, action) => {
      state.rows = action.payload;
    },
    setLoadingDocumentC: (state, action) => {
      state.loading = action.payload;
    },
    setErrorDocumentC: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setRowsDocumentC,
  setLoadingDocumentC,
  setErrorDocumentC,
} = getDocumentCSlice.actions;

export default getDocumentCSlice.reducer;

