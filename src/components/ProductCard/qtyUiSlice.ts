import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/store';

type QtyUiState = Record<number, number>;
const initialState: QtyUiState = {};

const qtyUiSlice = createSlice({
  name: 'qtyUi',
  initialState,
  reducers: {
    setQtyFor(state, action: PayloadAction<{ id: number; qty: number }>) {
      const { id, qty } = action.payload;
      const n = Number.isFinite(qty as number) ? Math.trunc(qty as number) : 1;
      state[id] = Math.max(1, n);
    },
    resetQty(state, action: PayloadAction<number>) {
      delete state[action.payload];
    },
  },
});

export const { setQtyFor, resetQty } = qtyUiSlice.actions;
export default qtyUiSlice.reducer;

export const selectQtyUiFor = (s: RootState, id: number) => {
  const v = s.qtyUi[id];
  return typeof v === 'number' && v >= 1 ? v : 1;
};
