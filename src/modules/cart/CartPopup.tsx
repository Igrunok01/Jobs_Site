import {
  Popover,
  ScrollArea,
  Group,
  Stack,
  Text,
  Image,
  Divider,
  Box,
} from '@mantine/core';
import { type ReactNode } from 'react';
import { QuantityControl } from '../../ui/QuantityControl';
import { splitName } from '../../utils/splitName';
import type { CartItem } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setOpened } from './cartUiSlice';
import { selectCartOpened } from './selectors';
type Props = {
  cart: CartItem[];
  children: ReactNode;
  onInc?: (id: number) => void;
  onDec?: (id: number) => void;
  total: number;
};

export default function CartPopup({
  cart,
  children,
  onInc,
  onDec,
  total,
}: Props) {
  const dispatch = useAppDispatch();
  const opened = useAppSelector(selectCartOpened);
  return (
    <Popover
      opened={opened}
      onChange={(v) => dispatch(setOpened(v))}
      position="bottom-end"
      trapFocus={false}
      shadow="md"
      radius="lg"
      withArrow
      arrowSize={12}
      withinPortal={false}
      transitionProps={{ duration: 0 }}
    >
      <Popover.Target>
        <Box onClick={() => dispatch(setOpened(!opened))} style={{ cursor: 'pointer' }}>
          {children}
        </Box>
      </Popover.Target>

      <Popover.Dropdown p="md" miw={340} maw={420}>
        {cart.length === 0 ? (
          <Stack align="center" gap="xs" py="sm">
            <Text c="dimmed" fz="sm">
              Your cart is empty!
            </Text>
          </Stack>
        ) : (
          <>
            <ScrollArea.Autosize mah={300}>
              <Stack gap="sm">
                {cart.map((item, idx) => {
                  const { title, meta } = splitName(item.name);

                  return (
                    <div key={item.id}>
                      <Group wrap="nowrap" align="center">
                        <Image
                          src={item.image}
                          w={36}
                          h={36}
                          fit="contain"
                          alt=""
                        />

                        <div style={{ flex: 1 }}>
                          <Group
                            justify="space-between"
                            align="center"
                            wrap="nowrap"
                          >
                            <Group
                              gap={6}
                              wrap="nowrap"
                              style={{ minWidth: 0 }}
                            >
                              <Text fw={600} fz="sm" lineClamp={1}>
                                {title}
                              </Text>
                              {meta && (
                                <Text
                                  c="dimmed"
                                  fz="xs"
                                  style={{ whiteSpace: 'nowrap' }}
                                >
                                  {meta}
                                </Text>
                              )}
                            </Group>

                            <QuantityControl
                              value={item.quantity}
                              readOnly
                              onInc={() => onInc?.(item.id)}
                              onDec={() => onDec?.(item.id)}
                              min={1}
                            />
                          </Group>

                          <Text mt={6} fw={700} fz="sm">
                            ${item.price * item.quantity}
                          </Text>
                        </div>
                      </Group>

                      {idx < cart.length - 1 && <Divider my="sm" />}
                    </div>
                  );
                })}
              </Stack>
            </ScrollArea.Autosize>

            <Divider my="sm" />

            <Group justify="space-between">
              <Text fw={700}>Total</Text>
              <Text fw={700}>${total}</Text>
            </Group>
          </>
        )}
      </Popover.Dropdown>
    </Popover>
  );
}
