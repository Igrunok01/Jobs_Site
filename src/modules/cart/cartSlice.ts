import type { Product, CartItem } from '../../types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type CartState = {
  cart: CartItem[];
};
const initialState: CartState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<{ product: Product; quantity: number }>,
    ) {
      const { product, quantity } = action.payload;
      const exist = state.cart.find((p) => p.id === product.id);
      if (exist) {
        exist.quantity += quantity;
      } else state.cart.push({ ...product, quantity });
    },
    setItemQuantity(
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) {
      const { id, quantity } = action.payload;
      if (quantity <= 0) state.cart = state.cart.filter((i) => i.id !== id);
      else {
        const item = state.cart.find((i) => i.id === id);
        if (item) item.quantity = quantity;
      }
    },
    inc(state, action: PayloadAction<{ id: number }>) {
      const { id } = action.payload;
      const clicked = state.cart.find((p) => p.id === id);
      if (clicked) clicked.quantity += 1;
    },
    dec(state, action: PayloadAction<{ id: number }>) {
      const { id } = action.payload;
      const item = state.cart.find((p) => p.id === id);
      if (!item) return;
      if (item.quantity > 1) item.quantity -= 1;
      else state.cart = state.cart.filter((p) => p.id !== id);
    },
  },
});

export const { addToCart, inc, dec, setItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;
