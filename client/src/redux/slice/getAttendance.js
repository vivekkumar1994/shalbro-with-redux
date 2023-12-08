


import { createSlice } from "@reduxjs/toolkit";

const getAttendanceSlice = createSlice({
  name: "getProject",
  initialState: {
    rows: [],
    loading: false,
    error: null,
  },
  reducers: {
    setRowsAttendance: (state, action) => {
      state.rows = action.payload;
    },
    setLoadingAttendance: (state, action) => {
      state.loading = action.payload;
    },
    setErrorAttendance: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setRowsAttendance,
  setLoadingAttendance,
  setErrorAttendance,
} = getAttendanceSlice.actions;

export default getAttendanceSlice.reducer;

