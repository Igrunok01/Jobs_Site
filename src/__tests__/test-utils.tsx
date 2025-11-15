import { MantineProvider, createTheme } from '@mantine/core';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { ReactElement, ReactNode } from 'react';

import { searchReducer } from '../features/search';
import { vacanciesReducer } from '../features/vacancies';
import { areaReducer } from '../features/area';
import { skillsReducer } from '../features/skills';

const testTheme = createTheme({
  components: {
    Popover: { defaultProps: { transitionProps: { duration: 0 } } },
    Modal: { defaultProps: { transitionProps: { duration: 0 } } },
    Drawer: { defaultProps: { transitionProps: { duration: 0 } } },
    Tooltip: { defaultProps: { transitionProps: { duration: 0 } } },
  },
});

const rootReducer = combineReducers({
  search: searchReducer,
  vacancies: vacanciesReducer,
  area: areaReducer,
  skills: skillsReducer,
});

export type TestRootState = ReturnType<typeof rootReducer>;
type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

export function setupTestStore(preloadedState?: DeepPartial<TestRootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as TestRootState | undefined,
  });
}
export type TestStore = ReturnType<typeof setupTestStore>;

type Options = {
  preloadedState?: DeepPartial<TestRootState>;
  store?: TestStore;
} & RenderOptions;

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = setupTestStore(preloadedState),
    ...options
  }: Options = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <MantineProvider theme={testTheme} env="test" forceColorScheme="light">
          {children}
        </MantineProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}
