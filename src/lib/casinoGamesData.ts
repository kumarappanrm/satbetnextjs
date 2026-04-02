import type {
  CasinoCategoryRecord,
  CasinoGameRecord,
  CasinoGamesCatalog,
} from '@/types/casino-games';

const DEFAULT_JSON = '/data/casino-games.json';

function slugFromLegacyHref(href: string): string {
  const path = href.split('?')[0].replace(/^\//, '').replace(/\/$/, '');
  return path || 'casino-games';
}

function normalizeCategory(c: Partial<CasinoCategoryRecord>): CasinoCategoryRecord {
  const slug = c.slug || c.id || (c.href ? slugFromLegacyHref(c.href) : 'casino-games');
  const id = c.id || slug;
  return {
    id,
    slug,
    label: c.label ?? slug,
    iconSrc: c.iconSrc,
    gradient: c.gradient,
    routePath: c.routePath ?? c.href ?? `/${slug}`,
    href: c.href,
    active: c.active,
  };
}

function normalizeGame(g: Partial<CasinoGameRecord>): CasinoGameRecord {
  const categoryIds =
    Array.isArray(g.categoryIds) && g.categoryIds.length > 0 ? g.categoryIds : ['casino-games'];
  return {
    id: g.id ?? '',
    name: g.name ?? '',
    provider: g.provider ?? '',
    providerSlug: g.providerSlug,
    categoryIds,
    thumbnailUrl: g.thumbnailUrl ?? '',
    providerLogoUrl: g.providerLogoUrl,
    playHref: g.playHref,
  };
}

export function normalizeCasinoGamesCatalog(raw: unknown): CasinoGamesCatalog {
  const data = raw as Partial<CasinoGamesCatalog>;
  if (!data || typeof data !== 'object' || !Array.isArray(data.games)) {
    throw new Error('Casino catalog: missing games array');
  }
  const categories = (data.categories ?? []).map((c) => normalizeCategory(c));
  const games = (data.games as Partial<CasinoGameRecord>[]).map(normalizeGame);
  return {
    version: data.version,
    pageTitle: data.pageTitle ?? 'Casino Games',
    categories,
    providers: data.providers ?? [{ label: 'All Game Providers', slug: '' }],
    games,
  };
}

/**
 * Loads the casino catalog from a JSON file under `public/` by default.
 * Set `NEXT_PUBLIC_CASINO_GAMES_DATA_URL` to any URL (your API) that returns the same JSON shape.
 */
export function getCasinoGamesDataUrl(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_CASINO_GAMES_DATA_URL || DEFAULT_JSON;
  }
  return process.env.NEXT_PUBLIC_CASINO_GAMES_DATA_URL || DEFAULT_JSON;
}

export async function fetchCasinoGamesCatalog(signal?: AbortSignal): Promise<CasinoGamesCatalog> {
  const url = getCasinoGamesDataUrl();
  const res = await fetch(url, {
    signal,
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Casino catalog failed: ${res.status} ${res.statusText}`);
  }
  return normalizeCasinoGamesCatalog(await res.json());
}
