import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import App from './app/App.tsx';
import { theme, cssVarsResolver } from './app/theme';
import { Provider } from 'react-redux';
import { setupStore } from './app/store.ts';

const store = setupStore();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider theme={theme} cssVariablesResolver={cssVarsResolver}>
        <App />
      </MantineProvider>
    </Provider>
  </React.StrictMode>,
);
