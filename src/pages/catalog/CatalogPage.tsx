import {
  AppShell,
  Container,
  Group,
  Title,
  Text,
  Button,
  SimpleGrid,
  Badge,
  Skeleton,
} from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';
import { ProductCard } from '../../components/ProductCard';
import { CartPopup, selectCount, selectTotal } from '../../modules/cart';
import { useProducts } from '../../modules/products';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { selectCartItems } from '../../modules/cart';
import { addToCart, inc, dec } from '../../modules/cart';

export default function App() {
  const { products, status, error } = useProducts();

  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCount);
  const total = useAppSelector(selectTotal);

  return (
    <AppShell header={{ height: 64 }} padding="md">
      <AppShell.Header withBorder>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between" align="center">
            <Group>
              <Title order={3}>Vegetable</Title>
              <Badge variant="light" color="brand" radius="sm">
                SHOP
              </Badge>
            </Group>

            <Group gap="md">
              <Text fw={600}>{count} товаров</Text>
              <Text c="dimmed">${total}</Text>

              <CartPopup
                cart={cartItems}
                onInc={(id) => dispatch(inc({ id }))}
                onDec={(id) => dispatch(dec({ id }))}
                total={total}
              >
                <Button
                  color="brand"
                  leftSection={<IconShoppingCart size={16} />}
                >
                  Cart
                </Button>
              </CartPopup>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main bg="var(--mantine-color-gray-1)">
        <Container size="lg" py="xl">
          <Title order={2} mb="lg">
            Catalog
          </Title>

          {status === 'idle' || status === 'loading' ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} height={280} radius="lg" />
              ))}
            </SimpleGrid>
          ) : status === 'failed' ? (
            <Text c="red">{error}</Text>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  {...p}
                  addToCart={(qty) =>
                    dispatch(addToCart({ product: p, quantity: qty }))
                  }
                />
              ))}
            </SimpleGrid>
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
