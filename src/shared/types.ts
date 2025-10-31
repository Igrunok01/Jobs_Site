export type HhVacancyRaw = {
  id: string;
  name: string;
  salary: { from?: number; to?: number; currency?: string } | null;
  employer?: { name?: string };
  area?: { name?: string };
  experience?: { name?: string };
  schedule?: { id?: string };
  alternate_url?: string;
  snippet?: { requirement?: string } | null;
};

export type VacanciesResponse = {
  items: HhVacancyRaw[];
  found: number;
  pages: number;
  page: number;
  per_page: number;
};

export type VacancyCardData = Pick<
  HhVacancyRaw,
  'id' | 'name' | 'salary' | 'employer' | 'area'
> & {
  experience?: string;
  workFormat?: 'remote' | 'office' | 'hybrid';
  urls?: { apply?: string };
};
