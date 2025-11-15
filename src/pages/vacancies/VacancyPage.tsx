import { useEffect, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/redux';
import { VacancyCard } from '../../entities/vacancy';
import {
  makeSelectVacancyById,
  selectVacancyStatusById,
  selectVacancyErrorById,
} from '../../features/vacancies/selectors';
import { fetchVacancyById } from '../../features/vacancies/thunks';
import {
  Stack,
  Skeleton,
  Alert,
  Button,
  Group,
  Container,
  Card,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

export default function VacancyPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const selectById = useMemo(makeSelectVacancyById, []);
  const vacancy = useAppSelector((s) => (id ? selectById(s, id) : undefined));
  const status = useAppSelector((s) =>
    id ? selectVacancyStatusById(s, id) : 'idle',
  );
  const error = useAppSelector((s) =>
    id ? selectVacancyErrorById(s, id) : undefined,
  );

  useEffect(() => {
    if (!id) return;
    if (!vacancy || !vacancy.description) {
      const p = dispatch(fetchVacancyById(id));
      return () => p.abort?.();
    }
  }, [id, vacancy, dispatch]);

  if (!id) {
    return <Navigate to="/vacancies" replace />;
  }

  if (vacancy)
    return (
      <Container size="sm" py="lg">
        <Stack gap="lg">
          <VacancyCard data={vacancy} />
          <Stack gap="md">
            {vacancy.description ? (
              <Card radius="lg" p="lg">
                <div
                  dangerouslySetInnerHTML={{ __html: vacancy.description }}
                />
              </Card>
            ) : (
              <Card radius="lg" p="lg">
                По данной вакансии нет описания
              </Card>
            )}
          </Stack>
        </Stack>
      </Container>
    );

  if (status === 'failed') {
    return (
      <Container size="sm" py="lg">
        <Stack p="md" gap="md">
          <Alert
            color="red"
            radius="md"
            icon={<IconAlertCircle size={16} />}
            title="Ошибка"
          >
            {error ?? 'Не удалось загрузить вакансию'}
          </Alert>
          <Group>
            <Button component={Link} to="/" color="dark" radius="md">
              На главную
            </Button>
          </Group>
        </Stack>
      </Container>
    );
  }
  return (
    <Container size="sm" py="lg">
      <Stack gap="md">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} height={229 + i * 200} radius="lg" />
        ))}
      </Stack>
    </Container>
  );
}
