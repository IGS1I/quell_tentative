/** "HH:MM" -> minutes since midnight. */
export function toMinutes(clock: string | null | undefined): number {
  if (!clock) return 0;
  const [h, m] = clock.split(':').map(Number);
  return h * 60 + m;
}

export function isoDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;

export function dayOfWeek(d: Date): string {
  return DAYS[d.getDay()];
}
