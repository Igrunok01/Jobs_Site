import { MantineProvider, createTheme } from '@mantine/core';
import {
  render,
  screen,
  waitFor,
  within,
  type RenderOptions,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { ReactElement, ReactNode } from 'react';
import { expect } from 'vitest';

import { cartReducer, cartUiReducer } from '../modules/cart';
import { productsReducer } from '../modules/products';
import { qtyUiReducer } from '../components/ProductCard';

const testTheme = createTheme({
  components: {
    Popover: {
      defaultProps: {
        transitionProps: { duration: 0 },
      },
    },
  },
});

const rootReducer = combineReducers({
  cart: cartReducer,
  cartUi: cartUiReducer,
  products: productsReducer,
  qtyUi: qtyUiReducer,
});

export type TestRootState = ReturnType<typeof rootReducer>;

type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

export function setupTestStore(preloadedState?: DeepPartial<TestRootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as TestRootState | undefined,
  });
}
export type TestStore = ReturnType<typeof setupTestStore>;

type Options = {
  preloadedState?: DeepPartial<TestRootState>;
  store?: TestStore;
} & RenderOptions;

export function renderWithMantine(
  ui: ReactElement,
  {
    preloadedState,
    store = setupTestStore(preloadedState),
    ...options
  }: Options = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <MantineProvider theme={testTheme} env="test" forceColorScheme="light">
          {children}
        </MantineProvider>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}

export async function openCartAndGetPopover(): Promise<HTMLElement> {
  const header = screen.getByRole('banner');
  const cartBtn = within(header).getByRole('button', { name: /^cart$/i });
  const trigger = cartBtn.closest(
    '[aria-haspopup="dialog"]',
  ) as HTMLElement | null;
  if (!trigger) throw new Error('Cart trigger not found');

  await userEvent.click(cartBtn);
  await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));

  let popover: HTMLElement | null = null;
  await waitFor(() => {
    const id = trigger.getAttribute('aria-controls');
    if (!id) throw new Error('No aria-controls on trigger');
    const el = document.getElementById(id)!;
    expect(el).toBeInTheDocument();
    expect(el).not.toHaveStyle({ display: 'none' });
    popover = el;
  });

  return popover!;
}

export function getCartSummaryRow(popover: HTMLElement): HTMLElement {
  const totalLabel = within(popover).getByText(/^Total$/i);
  const row = totalLabel.parentElement;
  if (!row) throw new Error('Total row container not found');
  return row;
}
