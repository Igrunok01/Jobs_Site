import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Product } from '../../types';
import ky from 'ky';

const URL =
  'https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json';

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>('products/fetch', async (_arg, { signal, rejectWithValue }) => {
  try {
    const data = await ky
      .get(URL, { timeout: 5000, retry: { limit: 2 }, signal })
      .json<Product[]>();
    return data;
  } catch (err: unknown) {
    if (
      (err instanceof DOMException && err.name === 'AbortError') ||
      (err instanceof Error && err.name === 'AbortError')
    ) {
      throw err;
    }
    return rejectWithValue('Не удалось загрузить продукты');
  }
});
