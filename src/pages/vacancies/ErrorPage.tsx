import {
  Button,
  Card,
  Text,
  Group,
  Stack,
  Container,
  Title,
  Image,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { sadCat } from '../../shared/images';

export default function ErrorPage() {
  return (
    <Container size="md" py="xl">
      <Card radius="12" p="xl" maw={707} mx="auto">
        <Stack gap="xl">
          <Group justify="space-between" wrap="nowrap">
            <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
              <Title order={1} c="var(--text)">
                Упс! Такой страницы не существует
              </Title>
              <Text fz={18} fw={400} c="var(--text)">
                Давайте перейдём к началу.
              </Text>
            </Stack>
            <Button
              component={Link}
              to="/vacancies/moscow"
              radius="sm"
              h={42}
              px={22}
              color="brand.7"
            >
              <Text fz={16}>На главную</Text>
            </Button>
          </Group>
          <Image src={sadCat} alt="Грустный котик" radius="12" fit="cover" />
        </Stack>
      </Card>
    </Container>
  );
}
