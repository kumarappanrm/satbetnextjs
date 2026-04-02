/** Catalog loaded from JSON (swap disk file for API later). */

export type CasinoGameRecord = {
  id: string;
  name: string;
  provider: string;
  /** Must match a `providers[].slug` (non-empty) for filtering */
  providerSlug?: string;
  /** Category ids from `categories[].id` (usually same as slug) */
  categoryIds: string[];
  thumbnailUrl: string;
  providerLogoUrl?: string;
  playHref?: string;
};

/** One horizontal icon pill in the casino lobby (Bingo, Slot games, …). */
export type CasinoCategoryRecord = {
  /** Stable id, used in `game.categoryIds` */
  id: string;
  /** URL query value: `/casino-games?category=<slug>` */
  slug: string;
  label: string;
  iconSrc?: string;
  /** Full CSS `background` (e.g. linear-gradient). If omitted, theme uses `data-cat` in CSS. */
  gradient?: string;
  /** Optional future full route (not used for SPA filter yet) */
  routePath?: string;
  /** @deprecated v1 — prefer `slug` + `id` */
  href?: string;
  /** @deprecated derive active state from URL in app */
  active?: boolean;
};

export type CasinoProviderRecord = {
  label: string;
  slug: string;
};

export type CasinoGamesCatalog = {
  version?: number;
  pageTitle?: string;
  categories: CasinoCategoryRecord[];
  providers: CasinoProviderRecord[];
  games: CasinoGameRecord[];
};
