import { createSlice } from '@reduxjs/toolkit';
import { fetchVacancies, fetchVacancyById } from './thunks';
import type { HhVacancyRaw, VacancyCardData } from '../../shared/types';
import { detectWorkFormat } from '../../shared/lib/workFormat';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

type VacanciesState = {
  entities: Record<string, VacancyCardData>;
  list: {
    ids: string[];
    pages: number;
    page: number;
    found: number;
    per_page: number;
  };
  status: Status;
  statusById: Record<string, Status | undefined>;
  error: string | null;
  errorById: Record<string, string | undefined>;
};

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

const initialState: VacanciesState = {
  entities: {},
  list: { ids: [], pages: 0, page: 1, found: 0, per_page: 0 },
  status: 'idle',
  statusById: {},
  error: null,
  errorById: {},
};

const vacanciesSlice = createSlice({
  name: 'vacancies',
  initialState,
  reducers: {
    setPage(state, action) {
      state.list.page = Math.max(1, Number(action.payload) || 1);
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchVacancies.pending, (s) => {
      s.status = 'loading';
      s.error = null;
    });
    b.addCase(fetchVacancies.fulfilled, (s, { payload, meta }) => {
      s.status = 'succeeded';
      const ids: string[] = [];
      for (const v of payload.items) {
        const card = toCard(v);
        s.entities[card.id] = card;
        ids.push(card.id);
      }
      // s.list.ids = ids;
      // s.list.pages = payload.pages;
      // s.list.found = payload.found;
      // s.list.per_page = payload.per_page;
      // const page0 = Number(meta.arg?.page ?? 0);
      // s.list.page = Number.isFinite(page0) ? page0 + 1 : 1;
      s.list.ids = ids;
      s.list.pages = payload.pages;
      s.list.page = (meta.arg?.page ?? 0) + 1;
      s.list.found = payload.found;
      s.list.per_page = payload.per_page;
    });
    b.addCase(fetchVacancies.rejected, (s, a) => {
      if (a.meta.aborted || a.error?.name === 'AbortError') return;
      s.status = 'failed';
      s.error =
        (a.payload as string | undefined) ??
        a.error?.message ??
        'Не удалось загрузить вакансии';
    })
      .addCase(fetchVacancyById.pending, (s, { meta }) => {
        s.statusById[meta.arg] = 'loading';
        s.errorById[meta.arg] = undefined;
      })
      .addCase(fetchVacancyById.fulfilled, (s, { payload }) => {
        s.entities[payload.id] = payload;
        s.statusById[payload.id] = 'succeeded';
      })
      .addCase(fetchVacancyById.rejected, (s, { meta, payload, error }) => {
        if (meta.aborted) return;
        s.statusById[meta.arg] = 'failed';
        s.errorById[meta.arg] =
          (payload as string | undefined) ?? error?.message ?? 'Ошибка';
      });
  },
});

export const { setPage } = vacanciesSlice.actions;
export default vacanciesSlice.reducer;
