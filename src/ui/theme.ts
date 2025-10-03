import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'brand',
  defaultRadius: 'lg',
  colors: {
    // Палитра под #54b46a, светлые тона для "subtle" кнопок
    brand: [
      '#eafbee',
      '#dbf2e8',
      '#b9e1c2',
      '#94d0a1',
      '#74c286',
      '#5fbb74',
      '#54b46a',
      '#439c58',
      '#388d40',
      '#2a7a3f',
    ],
  },
  fontFamily:
    'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
});
