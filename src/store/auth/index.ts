import { createSlice } from "@reduxjs/toolkit";
// import { AppState } from "./store";
import { User } from "CardicApp/src/types/user";
import { AppState } from "..";

// Type for our state
export interface AuthState {
  authState: boolean;
  user: User | null;
  token: string | null;
}

// Initial state
const initialState: AuthState = {
  authState: false,
  user: null,
  token: null
};

// Actual Slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to set the authentication status
    setAuthState(state, action) {
      state.authState = action.payload;
    },
    setAuthToken(state, action) {
      state.token = action.payload;
    },
    setUserInfo(state, action) {
      state.user = action.payload;
    },
  },
});

export const { setAuthState, setAuthToken, setUserInfo } = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth;

export default authSlice.reducer;