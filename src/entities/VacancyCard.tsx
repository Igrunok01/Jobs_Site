import { Card, Group, Stack, Title, Text, Badge, Button } from '@mantine/core';
import type { VacancyCardData } from '../shared/types';

const currencySymbol = (code?: string) =>
  code?.toUpperCase() === 'RUR' || code?.toUpperCase() === 'RUB'
    ? '₽'
    : (code ?? '₽');

export default function VacancyCard({ data }: { data: VacancyCardData }) {
  const salary = data.salary;
  const salaryText = salary
    ? [
        salary.from ? `от ${salary.from.toLocaleString('ru-RU')}` : null,
        salary.to ? `до ${salary.to.toLocaleString('ru-RU')}` : null,
      ]
        .filter(Boolean)
        .join(' ')
        .concat(` ${currencySymbol(salary.currency)}`)
    : 'З/п не указана';

  const formatBadge = (wf: VacancyCardData['workFormat']) => {
    switch (wf) {
      case 'remote':
        return (
          <Badge radius="xs" size="xs">
            Можно удалённо
          </Badge>
        );
      case 'hybrid':
        return (
          <Badge radius="xs" size="xs">
            Гибрид
          </Badge>
        );
      default:
        return (
          <Badge radius="xs" size="xs">
            Офис
          </Badge>
        );
    }
  };

  return (
    <Card radius="lg" p="lg">
      <Stack gap="sm">
        <Group justify="space-between" align="start">
          <Stack gap={4}>
            <Title order={3} c="brand.9">
              {data.name}
            </Title>
            <Group gap="md" wrap="wrap">
              <Text fw={400} c="var(--text)">
                {salaryText}
              </Text>
              {data.experience && (
                <Text c="var(--text-muted)" fz={14}>
                  Опыт {data.experience}
                </Text>
              )}
            </Group>
          </Stack>
        </Group>

        <Stack gap={4}>
          <Text c="var(--text-muted)" size="sm">
            {data.employer?.name}
          </Text>
          {formatBadge(data.workFormat)}
          <Text size="md" c="var(--text)">
            {data.area?.name}
          </Text>
        </Stack>
        <Group gap="sm">
          <Button color="dark" radius="sm">
            Смотреть вакансию
          </Button>
          <Button
            variant="default"
            component="a"
            href={data.urls?.apply ?? '#'}
            target="_blank"
            radius="sm"
            styles={{ root: { borderColor: 'transparent' } }}
            vars={() => ({
              root: {
                '--button-bg': 'var(--surface-weak)',
                '--button-hover': 'var(--surface-weak-hover)',
                '--button-color': 'var(--text)',
                '--button-bd': 'transparent',
              },
            })}
          >
            Откликнуться
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
