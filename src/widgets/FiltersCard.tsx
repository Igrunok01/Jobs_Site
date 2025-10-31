import {
  Card,
  Stack,
  Input,
  TextInput,
  ActionIcon,
  Group,
  Select,
  Pill,
} from '@mantine/core';
import { IconPlus, IconMapPin } from '@tabler/icons-react';
import { deleteIcon } from '../shared/images';
import { useAppDispatch, useAppSelector } from '../app/redux';
import { selectArea, setArea } from '../features/area';
import type { AreaValue } from '../features/area/areaSlice';
import {
  selectSkills,
  selectInputSkills,
  addSkill,
  setInput,
  removeSkill,
} from '../features/skills';

export default function FiltersCard() {
  const dispatch = useAppDispatch();
  const area = useAppSelector(selectArea);
  const skills = useAppSelector(selectSkills);
  const inputSkills = useAppSelector(selectInputSkills);

  return (
    <Stack gap={10}>
      <Card radius="12" p="24">
        <Stack gap="lg">
          <Stack gap="sm">
            <Input.Label>Ключевые навыки</Input.Label>
            <Group gap="8" align="center" wrap="nowrap">
              <TextInput
                value={inputSkills}
                placeholder="Навык"
                radius="md"
                flex={1}
                size="xs"
                onChange={(e) => dispatch(setInput(e.currentTarget.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    dispatch(addSkill());
                  }
                }}
              />
              <ActionIcon
                variant="filled"
                color="brand"
                radius="md"
                w={30}
                h={30}
                p={0}
                aria-label="Добавить навык"
                onClick={() => dispatch(addSkill())}
              >
                <IconPlus size={26} stroke={2} />
              </ActionIcon>
            </Group>

            <Group gap="sm">
              {skills.map((s) => (
                <Pill key={s} radius="xl" variant="light" bg="var(--app-bg)">
                  <Group gap={6} align="center" wrap="nowrap">
                    {s}
                    <ActionIcon
                      variant="transparent"
                      size={18}
                      aria-label={`Удалить ${s}`}
                      onClick={() => dispatch(removeSkill(s))}
                    >
                      <img src={deleteIcon} alt="Удалить навык" />
                    </ActionIcon>
                  </Group>
                </Pill>
              ))}
            </Group>
          </Stack>
        </Stack>
      </Card>
      <Card radius="12" p="24">
        <Select
          value={area}
          placeholder="Все города"
          leftSection={<IconMapPin size={16} />}
          leftSectionPointerEvents="none"
          radius="sm"
          onChange={(v) => dispatch(setArea((v ?? 'all') as AreaValue))}
          data={[
            { value: 'all', label: 'Все города' },
            { value: '1', label: 'Москва' },
            { value: '2', label: 'Санкт-Петербург' },
          ]}
        />
      </Card>
    </Stack>
  );
}
