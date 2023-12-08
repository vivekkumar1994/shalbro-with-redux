// adminSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    user: null,
    isAuthenticated: false,
    // other relevant state properties
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // add other reducers as needed
  },
});

export const { setUser } = adminSlice.actions;

export default adminSlice.reducer;
