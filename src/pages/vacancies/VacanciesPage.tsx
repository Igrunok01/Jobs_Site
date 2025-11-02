import {
  Container,
  Stack,
  Title,
  Grid,
  TextInput,
  Button,
  Pagination,
  Group,
  Divider,
  Box,
  Text,
  Alert,
  Skeleton,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import FiltersCard from '../../widgets/FiltersCard';
import { VacancyCard } from '../../entities/vacancy';
import { search } from '../../shared/images';

import {
  selectSearch,
  setParam,
  submit,
} from '../../features/search/searchSlice';
import { useAppDispatch, useAppSelector } from '../../app/redux';
import {
  selectVacancies,
  selectStatus,
  selectError,
  selectPages,
  selectPage,
  setPage,
  fetchVacancies,
} from '../../features/vacancies';
import { useEffect, useRef } from 'react';
import { selectSkills } from '../../features/skills';
import { selectArea } from '../../features/area';

export default function VacanciesPage() {
  const dispatch = useAppDispatch();
  const query = useAppSelector(selectSearch);
  const vacancies = useAppSelector(selectVacancies);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const pages = useAppSelector(selectPages);
  const page = useAppSelector(selectPage);
  const skills = useAppSelector(selectSkills);
  const area = useAppSelector(selectArea);

  useEffect(() => {
    const p = dispatch(
      fetchVacancies({ text: '', area: 'all', skills, page: 0 }),
    );
    return () => p.abort();
  }, []);

  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, area]);

  return (
    <Container size="lg" py="lg">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Stack gap={0}>
            <Title order={2}>Список вакансий</Title>
            <Title order={4} c="var(--text-muted)">
              по профессии Frontend-разработчик
            </Title>
          </Stack>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(submit());
            }}
            style={{ display: 'contents' }}
          >
            <Group gap="sm" wrap="nowrap">
              <TextInput
                value={query}
                onChange={(e) => dispatch(setParam(e.currentTarget.value))}
                miw={400}
                radius="md"
                placeholder="Должность или название компании"
                leftSection={<img src={search} alt="" width={16} height={16} />}
                leftSectionPointerEvents="none"
                styles={{ input: { height: 42 } }}
              />
              <Button
                type="submit"
                radius="md"
                h={42}
                px={22}
                loading={status === 'loading'}
              >
                <Text fz={16}>Найти</Text>
              </Button>
            </Group>
          </form>
        </Group>

        <Box mx="calc(50% - 50vw)">
          <Divider color="var(--surface-weak)" size="xs" />
        </Box>

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <FiltersCard />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            {status === 'failed' && (
              <Alert
                color="red"
                radius="md"
                icon={<IconAlertCircle size={16} />}
                title="Ошибка загрузки"
                mb="md"
              >
                {error ?? 'Не удалось загрузить вакансии. Повторите попытку.'}
              </Alert>
            )}

            {(status === 'loading' ||
              (status === 'idle' && vacancies.length === 0)) && (
              <Stack gap="md">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton
                    data-testid="vacancy-skeleton"
                    key={i}
                    height={229}
                    radius="lg"
                  />
                ))}
              </Stack>
            )}

            {status === 'succeeded' && vacancies.length === 0 && (
              <Text c="var(--text-muted)">
                По заданным условиям ничего не найдено.
              </Text>
            )}

            {status === 'succeeded' && vacancies.length > 0 && (
              <Stack gap="md">
                {vacancies.map((v) => (
                  <VacancyCard key={v.id} data={v} />
                ))}
                <Pagination
                  total={Math.max(1, pages)}
                  value={page}
                  onChange={(p) => {
                    dispatch(setPage(p));
                  }}
                />
              </Stack>
            )}
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
