import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "..";
import { Trade } from "CardicApp/src/types/trade";

// Type for our state
export interface BillState {
  form: any;
}

// Initial state
const initialState: BillState = {
  form: {},
};

// Actual Slice
export const authSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    setBillForm(state, action) {
      state.form = action.payload;
    },
  },
});

export const { setBillForm } = authSlice.actions;

export const selectBillState = (state: AppState) => state.bill;

export default authSlice.reducer;