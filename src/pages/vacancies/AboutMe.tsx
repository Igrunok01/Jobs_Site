import { Card, Stack, Text, Title } from '@mantine/core';

export default function AboutMe() {
  return (
    <Card radius={12} p={24} maw={658} mx="auto">
      <Stack gap={12}>
        <Title order={3} fz={26}>
          Лаврик Даниил Дмитриевич
        </Title>
        <Text fw={400} fz={16}>
          Привет! Я - Frontend-разработчик. Пишу приложения на React +
          TypeScript + Redux Toolkit. Работаю с современным стеком (React
          Router, Mantine), слежу за качеством кода и покрываю ключевую логику
          тестами.
        </Text>
      </Stack>
    </Card>
  );
}
