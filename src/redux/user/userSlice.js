import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

// Create slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    loginFail: (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    updateFail: (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions
export const {
  loginStart,
  loginSuccess,
  loginFail,
  updateStart,
  updateSuccess,
  updateFail,
  logout,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;
