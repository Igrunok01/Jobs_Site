import { AppShell, Container, Group, Text, Box } from '@mantine/core';
import { hh, point, userIcon, userIconActive } from '../shared/images';
import { useHover } from '@mantine/hooks';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function AppHeader() {
  const { hovered, ref } = useHover();
  const location = useLocation();
  return (
    <AppShell.Header
      withBorder={false}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 1)',
        boxShadow: '0px 2px 22.5px rgba(28, 29, 31, 0.05)',
      }}
    >
      <Container fluid py="md" mx={0}>
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
          }}
        >
          <Group gap="xs">
            <Box
              ref={ref}
              component={Link}
              to={{ pathname: '/vacancies', search: location.search }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                textDecoration: 'none',
                color: 'inherit',
                transition: 'background-color 120ms ease',
                backgroundColor: hovered ? 'rgba(0,0,0,0.06)' : 'transparent',
              }}
            >
              <img src={hh} alt="HeadHunter" width={30} height={30} />
              <Text fw={600}>.FrontEnd</Text>
            </Box>
          </Group>
          <Group gap="xl" h="24">
            <NavLink
              to={{ pathname: '/vacancies', search: location.search }}
              style={{ textDecoration: 'none' }}
            >
              {({ isActive }: { isActive: boolean }) => (
                <Group gap="xs">
                  <Text
                    fw={500}
                    fz={14}
                    c={isActive ? 'black' : 'var(--text-muted)'}
                  >
                    Вакансии FE
                  </Text>
                  <img
                    src={point}
                    alt=""
                    style={{ opacity: isActive ? 1 : 0 }}
                  />
                </Group>
              )}
            </NavLink>
            <NavLink
              to={{ pathname: '/about' }}
              style={{ textDecoration: 'none' }}
            >
              {({ isActive }: { isActive: boolean }) => (
                <Group gap="xs" align="center">
                  <img src={isActive ? userIconActive : userIcon}></img>
                  <Text
                    fw={500}
                    fz={14}
                    c={isActive ? 'black' : 'var(--text-muted)'}
                  >
                    Обо мне
                  </Text>
                  <img
                    src={point}
                    alt=""
                    style={{ opacity: isActive ? 1 : 0 }}
                  />
                </Group>
              )}
            </NavLink>
          </Group>
          <Box />
        </Box>
      </Container>
    </AppShell.Header>
  );
}
