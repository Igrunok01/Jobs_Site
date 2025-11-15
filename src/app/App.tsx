import { AppShell } from '@mantine/core';
import AppHeader from '../widgets/AppHeader';
import { VacanciesPage, VacancyPage, ErrorPage } from '../pages/vacancies';
import { Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppHeader />
      <AppShell.Main bg="var(--app-bg)" style={{ overflowX: 'clip' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/vacancies" replace />} />
          <Route path="/vacancies" element={<VacanciesPage />} />
          <Route path="/vacancies/:id" element={<VacancyPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}
