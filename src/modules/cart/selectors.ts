import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store/store';

export const selectCartSlice = (s: RootState) => s.cart;
export const selectCartItems = (s: RootState) => s.cart.cart;
export const selectCartOpened = (s: RootState) => s.cartUi.opened;

export const selectItemQuantity = createSelector(
  [selectCartItems, (_: RootState, id: number) => id],
  (items, id) => items.find((i) => i.id === id)?.quantity ?? 0,
);

export const selectCount = createSelector([selectCartItems], (items) =>
  items.reduce((acc, i) => acc + i.quantity, 0),
);

export const selectTotal = createSelector([selectCartItems], (items) =>
  items.reduce((acc, i) => acc + i.quantity * i.price, 0),
);
