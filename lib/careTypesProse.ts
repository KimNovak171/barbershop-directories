/**
 * Turn raw Google-style category labels into short, natural phrases for prose
 * (e.g. city page intros). Omits entries that do not look barber-shop-related.
 */

const EXACT_PHRASE: Record<string, string> = {
  "barber shop": "barber shops",
  barbershop: "barber shops",
  "barbería": "barberías",
  barbier: "barbiers",
  barbearia: "barbearias",
};

const BARBER_SHOP_LIKE =
  /barber|barbearia|barbier|barbería|haircut|shave|fade|taper|clipper|beard|mustache|stylist|tonsorial/i;

/** Labels that match common noise but are not barber shop services. */
const NON_SALON =
  /auto\s+repair|collision|transmission|student\s+dormitory|orthodox\s+church|storage\s+facility|insurance\s+agency|urolog/i;

function normalizeKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Fallback: lowercase prose, light plural / phrasing for service-style labels. */
function humanizeFallback(raw: string): string {
  const s = raw.trim().toLowerCase();
  if (!s) return "";
  if (s.endsWith(" service")) {
    return `${s.slice(0, -" service".length)} services`;
  }
  if (s.endsWith(" clinic")) {
    return s.replace(/ clinic$/, " clinics");
  }
  if (s.endsWith(" center")) {
    return s.replace(/ center$/, " centers");
  }
  if (!s.endsWith("s")) {
    return `${s}s`;
  }
  return s;
}

function phraseForLabel(raw: string): string | null {
  const key = normalizeKey(raw);
  if (!key) return null;
  if (NON_SALON.test(key)) return null;
  if (EXACT_PHRASE[key]) return EXACT_PHRASE[key];
  if (!BARBER_SHOP_LIKE.test(raw)) return null;
  return humanizeFallback(raw);
}

function oxfordJoin(items: string[]): string {
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/**
 * @param careTypes Raw labels from listings (dedupe before calling if needed).
 * @param maxItems Cap how many categories appear in the sentence (default 5).
 * @returns Clause starting with "including …" or a neutral fallback (no leading "including" duplicate in caller).
 */
export function formatCareTypesClause(
  careTypes: string[],
  maxItems = 5,
): string {
  const seen = new Set<string>();
  const phrases: string[] = [];
  for (const raw of careTypes) {
    const p = phraseForLabel(raw);
    if (!p || seen.has(p)) continue;
    seen.add(p);
    phrases.push(p);
    if (phrases.length >= maxItems) break;
  }
  if (phrases.length === 0) {
    return "including barber shops, barbers, haircuts, and shaves";
  }
  return `including ${oxfordJoin(phrases)}`;
}

/** Schema.org `Thing` entries for primary barber categories on this directory. */
export function barberCategorySchemaThings(): { "@type": "Thing"; name: string }[] {
  return [
    { "@type": "Thing", name: "Barber Shop" },
    { "@type": "Thing", name: "Barbería" },
    { "@type": "Thing", name: "Barbier" },
    { "@type": "Thing", name: "Barbearia" },
  ];
}

/** Default sentence when no care-type stats exist (FAQ answers, etc.). */
export const DEFAULT_BARBER_CARE_TYPES_SENTENCE =
  "Barber Shop, Barbería, Barbier, Barbearia";
