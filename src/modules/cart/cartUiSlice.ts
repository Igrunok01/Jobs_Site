import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type CartUiState = { opened: boolean };
const initialState: CartUiState = { opened: false };

const cartUiSlice = createSlice({
  name: 'cartUi',
  initialState,
  reducers: {
    setOpened(state, action: PayloadAction<boolean>) {
      state.opened = action.payload;
    },
  },
});

export const { setOpened } = cartUiSlice.actions;
export default cartUiSlice.reducer;
