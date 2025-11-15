import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  HhVacancyRaw,
  VacanciesResponse,
  VacancyCardData,
} from '../../shared/types';
import ky from 'ky';
import { detectWorkFormat } from '../../shared/lib/workFormat';

const BASE = 'https://api.hh.ru/vacancies';
export type Query = {
  text?: string;
  area?: '1' | '2' | 'all';
  skills?: string[];
  page?: number;
};

export const fetchVacancies = createAsyncThunk<
  VacanciesResponse,
  Query | undefined,
  { rejectValue: string }
>('Vacancies/fetch', async (params, { signal, rejectWithValue }) => {
  try {
    const { text, area, skills = [], page = 0 } = params ?? {};
    const finalText = [text, ...skills]
      .map((s) => (s ?? '').trim())
      .filter((s) => s.length > 0)
      .join(' ');
    const url = new URL(BASE);
    url.searchParams.set('professional_role', '96');
    url.searchParams.set('per_page', '10');
    url.searchParams.set('page', String(Math.max(0, page)));

    if (finalText) {
      url.searchParams.set('text', finalText);
      ['name', 'company_name', 'description'].forEach((f) =>
        url.searchParams.append('search_field', f),
      );
    }
    if (area && area !== 'all') url.searchParams.set('area', area);

    const data = await ky
      .get(url.toString(), {
        timeout: 5000,
        retry: { limit: 2 },
        signal,
      })
      .json<VacanciesResponse>();
    return data;
  } catch (err: unknown) {
    if (
      (err instanceof DOMException && err.name === 'AbortError') ||
      (err instanceof Error && err.name === 'AbortError')
    ) {
      throw err;
    }
    return rejectWithValue('Не удалось загрузить вакансии');
  }
});

const toCard = (v: HhVacancyRaw): VacancyCardData => ({
  id: v.id,
  name: v.name,
  salary: v.salary ?? null,
  experience: v.experience?.name,
  workFormat: detectWorkFormat(v),
  employer: { name: v.employer?.name ?? '' },
  area: { name: v.area?.name ?? '' },
  urls: { apply: v.alternate_url },
  description: v.description ?? null,
});

export const fetchVacancyById = createAsyncThunk<
  VacancyCardData,
  string,
  { rejectValue: string }
>('Vacancies/fetchOne', async (id, { signal, rejectWithValue }) => {
  try {
    const raw = await ky
      .get(`${BASE}/${id}`, { signal, timeout: 5000 })
      .json<HhVacancyRaw>();
    return toCard(raw);
  } catch (e: unknown) {
    if (
      (e instanceof DOMException && e.name === 'AbortError') ||
      (e instanceof Error && e.name === 'AbortError')
    ) {
      throw e;
    }
    let status: number | undefined;
    if (typeof e === 'object' && e !== null && 'response' in e) {
      const resp = (e as { response?: { status?: number } }).response;
      if (resp && typeof resp.status === 'number') {
        status = resp.status;
      }
    }
    const msg =
      status === 404
        ? 'Вакансия не найдена или удалена'
        : 'Не удалось загрузить вакансию';
    return rejectWithValue(msg);
  }
});
