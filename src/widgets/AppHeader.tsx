import { AppShell, Container, Group, Anchor, Text, Box } from '@mantine/core';
import { hh, point, userIcon } from '../shared/images';
export default function AppHeader() {
  return (
    <AppShell.Header
      withBorder={false}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 1)',
        boxShadow: '0px 2px 22.5px rgba(28, 29, 31, 0.05)',
      }}
    >
      <Container size="lg" py="md">
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
          }}
        >
          <Group gap="xs">
            <img src={hh} alt="HeadHunter" width="30" height="30" />
            <Text fw={600}>.FrontEnd</Text>
          </Group>
          <Group gap="xl" h="24">
            <Anchor href="#" underline="never">
              <Group gap="xs">
                <Text fw={500} fz={14} c="black">
                  Вакансии FE
                </Text>
                <img src={point}></img>
              </Group>
            </Anchor>
            <Anchor href="#" underline="never">
              <Group gap="xs" align="center">
                <img src={userIcon}></img>
                <Text fw={500} fz={14} c="var(--text-muted)">
                  Обо мне
                </Text>
              </Group>
            </Anchor>
          </Group>
          <Box />
        </Box>
      </Container>
    </AppShell.Header>
  );
}
