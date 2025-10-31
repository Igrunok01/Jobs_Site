import { createTheme, type CSSVariablesResolver } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'brand',
  colors: {
    brand: [
      '#e9efff',
      '#d7e2ff',
      '#c3d3ff',
      '#a9c2ff',
      '#8eafff',
      '#739cff',
      '#5b8aff',
      '#4263EB',
      '#3E59DE',
      '#364FC7',
    ],
  },
  defaultRadius: 'md',
  fontFamily:
    'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
});

export const cssVarsResolver: CSSVariablesResolver = () => ({
  variables: {
    '--app-bg': '#F6F6F7',
    '--text': '#0F0F10',
    '--text-muted': 'rgba(15,15,16,.5)',
    '--text-light': 'rgba(15,15,16,.3)',
    '--surface-weak': 'rgba(15,15,16,.10)',
    '--surface-weak-hover': 'rgba(15,15,16,.14)',
  },
  light: {},
  dark: {},
});
