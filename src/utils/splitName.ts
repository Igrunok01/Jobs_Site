export function splitName(name: string) {
  const i = name.indexOf('-');
  return i === -1
    ? { title: name, meta: '' }
    : { title: name.slice(0, i).trim(), meta: name.slice(i + 1).trim() };
}
