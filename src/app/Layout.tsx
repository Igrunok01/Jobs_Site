import { AppShell } from '@mantine/core';
import AppHeader from '../widgets/AppHeader';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppHeader />
      <AppShell.Main bg="var(--app-bg)" style={{ overflowX: 'clip' }}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
