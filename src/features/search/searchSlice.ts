import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

type searchState = { value: string };
const initialState: searchState = { value: '' };

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setParam(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
    submit() {},
  },
});

export const { setParam, submit } = searchSlice.actions;
export const searchReducer = searchSlice.reducer;

export const selectSearch = (s: RootState) => s.search.value;
