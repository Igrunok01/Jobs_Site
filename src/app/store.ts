import {
  configureStore,
  createListenerMiddleware,
  type TypedStartListening,
  type ListenerEffectAPI,
} from '@reduxjs/toolkit';
import {
  searchReducer,
  submit,
  selectSearch,
} from '../features/search/searchSlice';
import { vacanciesReducer, fetchVacancies } from '../features/vacancies';
import { areaReducer, selectArea, setArea } from '../features/area';
import {
  selectSkills,
  skillsReducer,
  addSkill,
  removeSkill,
} from '../features/skills';
import { setPage } from '../features/vacancies/slice';

const listener = createListenerMiddleware();

export const setupStore = () => {
  return configureStore({
    reducer: {
      search: searchReducer,
      vacancies: vacanciesReducer,
      area: areaReducer,
      skills: skillsReducer,
    },
    middleware: (gDM) => gDM().prepend(listener.middleware),
  });
};

export type AppStore = ReturnType<typeof setupStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
type AppStartListening = TypedStartListening<RootState, AppDispatch>;
const startAppListening = listener.startListening as AppStartListening;

let lastSubmit = 0;
const THROTTLE_MS = 400;
type Abortable = { abort?: (reason?: string) => void } | null;
let inflight: Abortable = null;

const runFetch = (
  api: ListenerEffectAPI<RootState, AppDispatch>,
  page0 = 0,
) => {
  inflight?.abort?.();
  const state = api.getState();
  const text = selectSearch(state).trim();
  const area = selectArea(state);
  const skills = selectSkills(state);
  inflight = api.dispatch(fetchVacancies({ text, area, skills, page: page0 }));
};

startAppListening({
  actionCreator: submit,
  effect: async (_action, api) => {
    const now = Date.now();
    if (now - lastSubmit < THROTTLE_MS) return;
    lastSubmit = now;
    api.dispatch(setPage(1));
    runFetch(api, 0);
  },
});

startAppListening({
  actionCreator: setArea,
  effect: async (_action, api) => {
    api.dispatch(setPage(1));
    runFetch(api, 0);
  },
});

startAppListening({
  actionCreator: setPage,
  effect: async (action, api) => {
    const uiPage = action.payload as number;
    const page0 = Math.max(0, uiPage - 1);
    runFetch(api, page0);
  },
});

startAppListening({
  actionCreator: addSkill,
  effect: async (_a, api) => {
    api.dispatch(setPage(1));
    runFetch(api, 0);
  },
});

startAppListening({
  actionCreator: removeSkill,
  effect: async (_a, api) => {
    api.dispatch(setPage(1));
    runFetch(api, 0);
  },
});
