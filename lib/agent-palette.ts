/** Hash an email to one of a few muted accent palettes so each agent gets
 * a stable chip/avatar color even though we don't persist one. Shared by
 * the assign-agent control, the chat header, and the inbox rows so the
 * same agent renders the same color everywhere. */
const CHIP_PALETTES = [
  "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "bg-amber-50 text-amber-700 ring-amber-200",
  "bg-rose-50 text-rose-700 ring-rose-200",
  "bg-sky-50 text-sky-700 ring-sky-200",
  "bg-violet-50 text-violet-700 ring-violet-200",
] as const;

export function paletteForEmail(email: string): string {
  let h = 0;
  for (let i = 0; i < email.length; i++) {
    h = (h * 31 + email.charCodeAt(i)) >>> 0;
  }
  return CHIP_PALETTES[h % CHIP_PALETTES.length];
}
