import { createSlice } from '@reduxjs/toolkit';
import { fetchProducts } from './productsThunks';
import type { Product } from '../../types';

type ProductState = {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: ProductState = {
  items: [],
  status: 'idle',
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        if (action.meta.aborted || action.error?.name === 'AbortError') {
          return;
        }
        state.error =
          (action.payload as string | undefined) ??
          action.error?.message ??
          'Unknown error';
      });
  },
});

export default productsSlice.reducer;
