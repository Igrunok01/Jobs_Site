import type { RootState } from '../../app/store';
import type { VacancyCardData } from '../../shared/types';
import { createSelector } from '@reduxjs/toolkit';

export const selectPages = (s: RootState) => s.vacancies.list.pages;
export const selectPage = (s: RootState) => s.vacancies.list.page;

const selectIds = (s: RootState) => s.vacancies.list.ids;
const selectEntities = (s: RootState) => s.vacancies.entities;
export const selectVacancies = createSelector(
  [selectIds, selectEntities],
  (ids, entities): VacancyCardData[] =>
    ids.map((id) => entities[id]!).filter(Boolean),
);

export const selectStatus = (s: RootState) => s.vacancies.status;
export const selectError = (s: RootState) => s.vacancies.error;

export const selectVacancyStatusSafe = (s: RootState, id?: string) =>
  id ? (s.vacancies.statusById[id] ?? 'idle') : 'idle';

export const selectVacancyErrorSafe = (s: RootState, id?: string) =>
  id ? s.vacancies.errorById[id] : undefined;

export const selectVacancyById = (s: RootState, id?: string) =>
  id ? s.vacancies.entities[id] : undefined;
