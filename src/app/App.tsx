import { AppShell } from '@mantine/core';
import AppHeader from '../widgets/AppHeader';
import { VacanciesPage } from '../pages/vacancies';

export default function App() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppHeader />
      <AppShell.Main bg="var(--app-bg)" style={{ overflowX: 'clip' }}>
        <VacanciesPage />
      </AppShell.Main>
    </AppShell>
  );
}
