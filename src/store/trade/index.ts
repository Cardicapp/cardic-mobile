import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "..";
import { Trade } from "CardicApp/src/types/trade";

// Type for our state
export interface TradeState {
  form: any;
  selectedTrade?: Trade;
}

// Initial state
const initialState: TradeState = {
  form: {},
};

// Actual Slice
export const authSlice = createSlice({
  name: "trade",
  initialState,
  reducers: {
    // Action to set the authentication status
    setTradeForm(state, action) {
      state.form = action.payload;
    },
    setSelectedTrade(state, action){
      state.selectedTrade = action.payload;
    }
  },
});

export const { setTradeForm, setSelectedTrade } = authSlice.actions;

export const selectTradeState = (state: AppState) => state.trade;

export default authSlice.reducer;