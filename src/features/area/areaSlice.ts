import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export type AreaValue = 'all' | '1' | '2';

const initialState: { val: AreaValue } = { val: 'all' };

const areaSlice = createSlice({
  name: 'area',
  initialState,
  reducers: {
    setArea(state, action: PayloadAction<AreaValue>) {
      state.val = action.payload;
    },
  },
});

export const { setArea } = areaSlice.actions;
export default areaSlice.reducer;
export const selectArea = (s: RootState) => s.area.val;
