import type { RootState } from '../../store/store';

export const selectProducts = (s: RootState) => s.products.items;
export const selectError = (s: RootState) => s.products.error;
export const selectStatus= (s: RootState) => s.products.status;
