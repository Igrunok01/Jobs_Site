import type { RootState } from '../../app/store';
import type { VacancyCardData, HhVacancyRaw } from '../../shared/types';
import { detectWorkFormat } from '../../shared/lib/workFormat';
import { createSelector } from '@reduxjs/toolkit';

const toCard = (v: HhVacancyRaw): VacancyCardData => ({
  id: v.id,
  name: v.name,
  salary: v.salary,
  experience: v.experience?.name,
  workFormat: detectWorkFormat(v),
  employer: { name: v.employer?.name ?? '' },
  area: { name: v.area?.name ?? '' },
  urls: { apply: v.alternate_url },
});

export const selectPages = (s: RootState) => s.vacancies.items.pages;
export const selectPage = (s: RootState) => s.vacancies.page;

const selectRaw = (s: RootState) => s.vacancies.items.items;
export const selectVacancies = createSelector([selectRaw], (raw) =>
  raw.map(toCard),
);

export const selectError = (s: RootState) => s.vacancies.error;
export const selectStatus = (s: RootState) => s.vacancies.status;
