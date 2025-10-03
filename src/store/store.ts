import { configureStore } from '@reduxjs/toolkit';
import { cartReducer } from '../modules/cart';
import { qtyUiReducer } from '../components/ProductCard';
import { productsReducer } from '../modules/products';
import { cartUiReducer } from '../modules/cart';

export const setupStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      qtyUi: qtyUiReducer,
      products: productsReducer,
      cartUi: cartUiReducer,
    },
  });
};

export type AppStore = ReturnType<typeof setupStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
