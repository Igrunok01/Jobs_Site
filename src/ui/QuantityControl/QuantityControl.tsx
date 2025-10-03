import { ActionIcon, NumberInput } from '@mantine/core';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import styles from './QuantityControl.module.css';

type Props = {
  value: number;
  min?: number;
  readOnly?: boolean;
  onChange?: (next: number) => void;
  onInc?: () => void;
  onDec?: () => void;
};

export default function QuantityControl({
  value,
  min = 1,
  readOnly = false,
  onChange,
  onInc,
  onDec,
}: Props) {
  const dec = () => {
    if (onDec) return onDec();
    if (onChange) onChange(Math.max(min, value - 1));
  };

  const inc = () => {
    if (onInc) return onInc();
    if (onChange) onChange(value + 1);
  };

  return (
    <div className={styles.wrap}>
      <ActionIcon className={styles.btn} aria-label="Minus" onClick={dec}>
        <IconMinus size={14} />
      </ActionIcon>

      <NumberInput
        value={value}
        onChange={(val) => {
          if (readOnly || !onChange) return;
          const n = Number(val);
          onChange(Number.isFinite(n) ? Math.max(min, n) : min);
        }}
        min={min}
        hideControls
        variant="unstyled"
        readOnly={readOnly}
        classNames={{ input: styles.input }}
        w={24}
        aria-label="Quantity"
      />

      <ActionIcon className={styles.btn} aria-label="Plus" onClick={inc}>
        <IconPlus size={14} />
      </ActionIcon>
    </div>
  );
}
