import type { HhVacancyRaw } from '../types';

const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е');

export function detectWorkFormat(
  v: HhVacancyRaw,
): 'remote' | 'hybrid' | 'office' {
  if (v.schedule?.id === 'remote') return 'remote';

  const text = norm(`${v.name} ${v.snippet?.requirement ?? ''}`);

  const remoteStrong = [
    'full remote',
    'remote only',
    '100% remote',
    'полностью удаленно',
    'только удаленно',
  ];
  if (remoteStrong.some((k) => text.includes(k))) return 'remote';

  if (text.includes('гибрид')) return 'hybrid';

  const remoteLoose = ['удаленно', 'дистанционно', 'remote'];
  const officeWords = ['офис', 'onsite', 'онсайт'];
  if (
    remoteLoose.some((k) => text.includes(k)) &&
    officeWords.some((k) => text.includes(k))
  ) {
    return 'hybrid';
  }

  return 'office';
}
