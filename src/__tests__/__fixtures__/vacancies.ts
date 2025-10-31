import type { VacanciesResponse } from '../../shared/types';

export const vacanciesFixture: VacanciesResponse = {
  items: Array.from({ length: 10 }).map((_, i) => ({
    id: String(1000 + i),
    name: `Frontend Dev #${i + 1}`,
    salary: { from: 150000, to: 250000, currency: 'RUR' },
    employer: { name: 'ACME' },
    area: { name: 'Москва' },
    experience: { name: '1–3 года' },
    schedule: { id: 'remote' },
    alternate_url: 'https://hh.ru/vacancy/123',
    snippet: { requirement: 'React, TypeScript, Redux' },
  })),
  found: 200,
  pages: 20,
  page: 0,
  per_page: 10,
};
