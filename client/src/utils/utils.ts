
export function getInstanceKey(str: string) {
  const arr = str.split('"');
  return arr[1];
}