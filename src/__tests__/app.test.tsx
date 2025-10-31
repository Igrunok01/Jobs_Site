import { describe, expect, it, beforeEach, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../app/App';
import { vacanciesFixture } from './__fixtures__/vacancies';
import { renderWithProviders } from './test-utils';

let mockJson: unknown = null;

vi.mock('ky', () => {
  const recordGet = vi.fn((url?: string, options?: unknown) => {
    void url;
    void options;
    return { json: vi.fn(() => Promise.resolve(mockJson)) };
  });

  const client = { get: recordGet };
  const create = vi.fn(() => client);
  const extend = vi.fn(() => client);

  return { __esModule: true, default: client, get: recordGet, create, extend };
});

describe('Jobs_Site', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockJson = vacanciesFixture;
    renderWithProviders(<App />);
    await screen.findByRole('heading', { name: /список вакансий/i });
    await screen.findAllByRole('link', { name: /откликнуться/i });
  });

  it('Hides skeletons after load and renders at least one "Apply" link', async () => {
    const applyLinks = await screen.findAllByRole('link', {
      name: /откликнуться/i,
    });
    expect(applyLinks.length).toBeGreaterThan(0);
    expect(screen.queryAllByTestId('vacancy-skeleton')).toHaveLength(0);
  });

  it('Header renders logo, title and FE link', () => {
    expect(screen.getByAltText('HeadHunter')).toBeInTheDocument();
    expect(screen.getByText(/\.FrontEnd/)).toBeInTheDocument();
    expect(screen.getByText(/вакансии fe/i)).toBeInTheDocument();
    expect(screen.getByText(/обо мне/i)).toBeInTheDocument();
  });

  it('Adding "React Query" skill shows a chip', async () => {
    const skillsInput = screen.getByPlaceholderText(/навык/i);
    await userEvent.type(skillsInput, 'React Query');
    await userEvent.click(
      screen.getByRole('button', { name: /добавить навык/i }),
    );
    expect(await screen.findByText(/react query/i)).toBeInTheDocument();
  });

  it('City Select shows chosen value "Москва" in the field', async () => {
    const cityField = screen.getByPlaceholderText(
      /все города/i,
    ) as HTMLInputElement;
    await userEvent.click(cityField);
    const listbox = await screen.findByRole('listbox');
    await userEvent.click(
      within(listbox).getByRole('option', { name: 'Москва' }),
    );
    expect(cityField).toHaveValue('Москва');
  });

  it('Search input accepts typing and shows typed value', async () => {
    const input = screen.getByPlaceholderText(
      /должность или название компании/i,
    ) as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, 'React');
    expect(input).toHaveValue('React');
  });

  it('Pagination renders at least pages "1" and "2"', () => {
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
  });
});
