import { describe, expect, it, beforeEach, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { productsFixture } from './__fixtures__/products';
import {
  getCartSummaryRow,
  openCartAndGetPopover,
  renderWithMantine,
} from './test-utils';

type Product = (typeof productsFixture)[number];
let mockProducts: Product[] = [];

vi.mock('ky', () => {
  return {
    __esModule: true,
    default: {
      get: vi.fn(() => ({
        json: vi.fn(() => Promise.resolve(mockProducts)),
      })),
    },
  };
});

describe('Vegetable Shop', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockProducts = productsFixture.slice();
    renderWithMantine(<App />);
    await screen.findAllByRole('img');
  });

  it('Shows loader then renders product list after fetch', async () => {
    const imgs = await screen.findAllByRole('img');
    expect(imgs.length).toBe(productsFixture.length);
  });

  it('ProductCard quantity control increments and decrements (min = 1)', async () => {
    const plus = screen.getAllByRole('button', { name: /plus/i })[0];
    const minus = screen.getAllByRole('button', { name: /minus/i })[0];
    const qty = screen.getAllByLabelText(/quantity/i)[0] as HTMLInputElement;

    expect(qty).toHaveValue('1');
    await userEvent.click(plus);
    expect(qty).toHaveValue('2');
    await userEvent.click(minus);
    expect(qty).toHaveValue('1');
  });

  it('Add to cart uses selected quantity and updates header count and total', async () => {
    const plus = screen.getAllByRole('button', { name: /plus/i })[0];
    const addBtn = screen.getAllByRole('button', { name: /add to cart/i })[0];
    const header = screen.getByRole('banner');

    await userEvent.click(plus);
    await userEvent.click(plus);
    await userEvent.click(addBtn);

    await waitFor(() =>
      expect(within(header).getByText(/товаров/i)).toHaveTextContent('3'),
    );
    const expectedTotal = 3 * productsFixture[0].price;
    expect(within(header).getByText(/\$/)).toHaveTextContent(
      String(expectedTotal),
    );
  });

  it('Cart popover opens on “Cart” click and lists items with line totals', async () => {
    await userEvent.click(
      screen.getAllByRole('button', { name: /add to cart/i })[0],
    );

    const header = screen.getByRole('banner');
    await waitFor(() =>
      expect(within(header).getByText(/товаров/i)).toHaveTextContent('1'),
    );

    const popover = await openCartAndGetPopover();
    const title = productsFixture[0].name.split('-')[0].trim();
    expect(within(popover).getByText(title)).toBeInTheDocument();
  });

  it('Cart popover “+” increases quantity and updates total summary', async () => {
    await userEvent.click(
      screen.getAllByRole('button', { name: /add to cart/i })[0],
    );

    const header = screen.getByRole('banner');
    await waitFor(() =>
      expect(within(header).getByText(/товаров/i)).toHaveTextContent('1'),
    );

    const popover = await openCartAndGetPopover();
    const plus = await within(popover).findByLabelText(/^plus$/i);
    await userEvent.click(plus);

    const expected = 2 * productsFixture[0].price;
    const summaryRow = getCartSummaryRow(popover);
    await waitFor(() =>
      expect(within(summaryRow).getByText('$' + expected)).toBeInTheDocument(),
    );
  });

  it('Cart popover “−” at qty=1 removes item.', async () => {
    await userEvent.click(
      screen.getAllByRole('button', { name: /add to cart/i })[0],
    );

    const header = screen.getByRole('banner');
    await waitFor(() =>
      expect(within(header).getByText(/товаров/i)).toHaveTextContent('1'),
    );

    const popover = await openCartAndGetPopover();
    const minus = await within(popover).findByLabelText(/^minus$/i);

    await userEvent.click(minus);
    await waitFor(() =>
      expect(
        within(popover).getByText(/your cart is empty/i),
      ).toBeInTheDocument(),
    );
  });
});
