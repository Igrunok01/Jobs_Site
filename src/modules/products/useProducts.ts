import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { selectError, selectStatus, selectProducts } from './selectors';
import { fetchProducts } from './productsThunks';

export function useProducts() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const error = useAppSelector(selectError);
  const status = useAppSelector(selectStatus);

  useEffect(() => {
    const p = dispatch(fetchProducts());
    return () => p.abort();
  }, [dispatch]);

  return { products, status, error };
}
