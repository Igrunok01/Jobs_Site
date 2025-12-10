export { default as vacanciesReducer } from './slice';
export { fetchVacancies } from './thunks';
export type { Query } from './thunks';
export {
  selectVacancies,
  selectStatus,
  selectError,
  selectPages,
  selectPage,
  selectVacancyById,
} from './selectors';
export { setPage } from './slice';
