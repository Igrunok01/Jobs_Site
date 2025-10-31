import { createSlice } from '@reduxjs/toolkit';
import { fetchVacancies } from './thunks';
import type { VacanciesResponse } from '../../shared/types';

type VacancyState = {
  items: VacanciesResponse;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
};

const initialState: VacancyState = {
  items: {
    items: [],
    found: 0,
    pages: 0,
    page: 0,
    per_page: 0,
  },
  status: 'idle',
  error: null,
  page: 1,
};

const vacanciesSlice = createSlice({
  name: 'vacancies',
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = Math.max(1, action.payload as number);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVacancies.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchVacancies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        const page0 = Number(action.meta.arg?.page ?? 0);
        state.page = Number.isFinite(page0) ? page0 + 1 : 1;
      })
      .addCase(fetchVacancies.rejected, (state, action) => {
        if (action.meta.aborted || action.error?.name === 'AbortError') {
          return;
        }
        state.status = 'failed';
        state.error =
          (action.payload as string | undefined) ??
          action.error?.message ??
          'Не удалось загрузить вакансии';
      });
  },
});

export const { setPage } = vacanciesSlice.actions;
export default vacanciesSlice.reducer;
