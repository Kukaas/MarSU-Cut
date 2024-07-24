import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  currentEmail: null,
  loading: false,
  error: null,
};

// Create slice
export const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    forgotPasswordStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    forgotPasswordSuccess: (state, action) => {
      state.loading = false;
      state.currentEmail = action.payload;
      state.error = null;
    },
    forgotPasswordFail: (state, action) => {
      state.loading = false;
      state.currentEmail = null;
      state.error = action.payload;
    },
  },
});

// Export actions
export const {
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFail,
} = forgotPasswordSlice.actions;

// Export reducer
export default forgotPasswordSlice.reducer;
