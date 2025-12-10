import { describe, expect, it, beforeEach, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode, AnchorHTMLAttributes } from 'react';
import { VacanciesPage } from '../pages/vacancies';
import AppHeader from '../widgets/AppHeader';
import { vacanciesFixture } from './__fixtures__/vacancies';
import { renderWithProviders } from './test-utils';
import { fetchVacancies } from '../features/vacancies';
import { AppShell } from '@mantine/core';

vi.mock('react-router-dom', () => {
  type LinkLikeProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    to?: string | { pathname?: string; search?: string };
    children?: ReactNode | ((args: { isActive: boolean }) => ReactNode);
  };

  const resolveTo = (to?: LinkLikeProps['to']): string | undefined => {
    if (!to) return undefined;
    if (typeof to === 'string') return to;
    if (typeof to === 'object') {
      const pathname = to.pathname ?? '';
      const search = to.search ?? '';
      return `${pathname}${search}`;
    }
    return undefined;
  };

  const Link = ({ to, children, ...rest }: LinkLikeProps) => {
    const href = resolveTo(to);
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };

  const NavLink = ({ to, children, ...rest }: LinkLikeProps) => {
    const href = resolveTo(to);
    const content =
      typeof children === 'function' ? children({ isActive: false }) : children;
    return (
      <a href={href} {...rest}>
        {content}
      </a>
    );
  };

  type UseSearchParamsResult = [
    URLSearchParams,
    (nextInit: URLSearchParams) => void,
  ];

  return {
    Link,
    NavLink,

    useLocation: () => ({
      pathname: '/vacancies',
      search: '?q=React',
      hash: '',
      state: null,
      key: 'test',
    }),
    useSearchParams: (): UseSearchParamsResult => {
      const params = new URLSearchParams();
      const setParams = () => {};
      return [params, setParams];
    },

    useParams: () => ({ id: '1' }) as Record<string, string | undefined>,

    useNavigate: () => () => {},
  };
});

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

type FetchVacanciesArgs = Parameters<typeof fetchVacancies>[0];

function renderVacanciesPage() {
  const { store } = renderWithProviders(<VacanciesPage />);

  const args: FetchVacanciesArgs = {
    text: '',
    area: 'all',
    skills: [],
    page: 0,
  };
  store.dispatch(
    fetchVacancies.fulfilled(vacanciesFixture, 'test-request', args),
  );
  return store;
}

function renderHeader() {
  return renderWithProviders(
    <AppShell header={{ height: 60 }}>
      <AppHeader />
    </AppShell>,
  );
}

describe('Jobs_Site', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockJson = vacanciesFixture;

    renderVacanciesPage();

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
    renderHeader();
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

  it('Header "Обо мне" link points to "/about"', () => {
    renderHeader();
    const aboutText = screen.getByText(/обо мне/i);
    const aboutLink = aboutText.closest('a');
    expect(aboutLink).not.toBeNull();
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('Header logo link points to "/vacancies" and preserves search params', () => {
    renderHeader();
    const logoImg = screen.getByAltText('HeadHunter');
    const logoLink = logoImg.closest('a');
    expect(logoLink).not.toBeNull();
    expect(logoLink).toHaveAttribute('href', '/vacancies?q=React');
  });
});
