// utils/eventTimestamp.ts
export function resolveEventTimestamp(input?: Date | string): Date {
  if (!input) return new Date();

  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return new Date();

  // optional sanity check (e.g., no events > 24h in the future)
  if (date.getTime() > Date.now() + 24 * 60 * 60 * 1000) {
    return new Date();
  }

  return date;
}
