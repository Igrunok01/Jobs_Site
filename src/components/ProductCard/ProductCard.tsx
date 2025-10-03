import { Card, Image, Text, Group, Button, AspectRatio } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';
import styles from './ProductCard.module.css';
import { QuantityControl } from '../../ui/QuantityControl';
import { splitName } from '../../utils/splitName';
import type { Product } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { selectItemQuantity, setItemQuantity } from '../../modules/cart';
import { setQtyFor, resetQty, selectQtyUiFor } from './qtyUiSlice';

export default function ProductCard({
  id,
  name,
  price,
  image,
  addToCart,
}: Product & { addToCart: (quantity: number) => void }) {
  const { title, meta } = splitName(name);
  const dispatch = useAppDispatch();
  const inCartQty = useAppSelector((s) => selectItemQuantity(s, id));
  const draftQty = useAppSelector((s) => selectQtyUiFor(s, id));
  return (
    <Card
      withBorder
      shadow="xs"
      radius="xl"
      padding="lg"
      className={styles.card}
    >
      <Card.Section p="md" pb={0}>
        <AspectRatio ratio={1}>
          <Image src={image} alt={name} fit="contain" />
        </AspectRatio>
      </Card.Section>

      <Group
        justify="space-between"
        wrap="nowrap"
        align="center"
        mt="md"
        mb={6}
      >
        <Group gap={6} wrap="nowrap" style={{ minWidth: 0, flex: '1 1 67%' }}>
          <Text fw={600} lineClamp={1}>
            {title}
          </Text>
          {meta && (
            <Text c="dimmed" fz="sm" style={{ whiteSpace: 'nowrap' }}>
              {meta}
            </Text>
          )}
        </Group>
        <QuantityControl
          value={inCartQty > 0 ? inCartQty : Math.max(1, draftQty || 1)}
          onChange={(next) => {
            if (inCartQty > 0) {
              dispatch(setItemQuantity({ id, quantity: Math.max(0, next) }));
            } else {
              dispatch(setQtyFor({ id, qty: Math.max(1, next || 0) }));
            }
          }}
          min={inCartQty > 0 ? 0 : 1}
        />
      </Group>
      <Group justify="space-between" mt="xs">
        <Text fw={700}>${price}</Text>
        <Button
          color="brand"
          variant="light"
          rightSection={<IconShoppingCart size={16} />}
          onClick={() => {
            addToCart(Math.max(1, draftQty || 0));
            dispatch(resetQty(id));
          }}
          className={styles.addBtn}
        >
          Add to cart
        </Button>
      </Group>
    </Card>
  );
}
