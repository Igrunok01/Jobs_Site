import { Card, Group, Stack, Title, Text, Badge, Button } from '@mantine/core';
import type { VacancyCardData } from '../../shared/types';
import { Link, useLocation } from 'react-router-dom';

const currencySymbol = (code?: string) =>
  code?.toUpperCase() === 'RUR' || code?.toUpperCase() === 'RUB'
    ? '₽'
    : (code ?? '₽');

function getExperienceLabel(exp: unknown): string | undefined {
  if (!exp) return undefined;
  if (typeof exp === 'string') return exp;
  if (typeof exp === 'object' && exp && 'name' in exp) {
    const name = (exp as { name?: unknown }).name;
    return typeof name === 'string' ? name : undefined;
  }
  return undefined;
}

function getAreaLabel(area: unknown): string | undefined {
  if (!area) return undefined;
  if (typeof area === 'string') return area;
  if (typeof area === 'object' && area && 'name' in area) {
    const name = (area as { name?: unknown }).name;
    return typeof name === 'string' ? name : undefined;
  }
  return undefined;
}

type WithName = { name?: unknown };

function getLabel(x: unknown): string | undefined {
  if (!x) return undefined;
  if (typeof x === 'string') return x;

  if (typeof x === 'object' && x !== null && 'name' in x) {
    const obj = x as WithName;
    return typeof obj.name === 'string' ? obj.name : undefined;
  }
  return undefined;
}

export default function VacancyCard({ data }: { data: VacancyCardData }) {
  const location = useLocation();
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

  const experienceLabel = getExperienceLabel(data.experience);
  const areaLabel = getAreaLabel(data.area);
  const employerName = getLabel(data.employer);

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
              {experienceLabel && (
                <Text c="var(--text-muted)" fz={14}>
                  Опыт {experienceLabel}
                </Text>
              )}
            </Group>
          </Stack>
        </Group>

        <Stack gap={4}>
          {employerName && (
            <Text c="var(--text-muted)" size="sm">
              {employerName}
            </Text>
          )}
          {formatBadge(data.workFormat)}
          {areaLabel && (
            <Text size="md" c="var(--text)">
              {areaLabel}
            </Text>
          )}
        </Stack>
        {location.pathname === '/vacancies' ? (
          <Group gap="sm">
            <Button
              component={Link}
              to={{
                pathname: `/vacancies/${data.id}`,
                search: location.search,
              }}
              color="dark"
              radius="sm"
            >
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
        ) : (
          <Group>
            <Button
              component="a"
              href={data.urls?.apply ?? '#'}
              target="_blank"
              color="dark"
              radius="sm"
            >
              Откликнуться на hh.ru
            </Button>
          </Group>
        )}
      </Stack>
    </Card>
  );
}
