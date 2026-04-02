'use client';

import React, { Suspense, useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoginModal from '@/components/forms/LoginModal';
import SignupModal from '@/components/forms/SignupModal';
import CasinoGamesToolbar from '@/components/casino/CasinoGamesToolbar';
import CasinoCategoryStrip from '@/components/casino/CasinoCategoryStrip';
import CasinoGameGrid from '@/components/casino/CasinoGameGrid';
import { APP_CONFIG } from '@/config/constants';
import { useAuth } from '@/store/authContext';
import { FEATURES } from '@/config/features';
import type { CasinoGameRecord, CasinoGamesCatalog } from '@/types/casino-games';
import '@/styles/casino-games.css';

export type CasinoGamesPageProps = {
  initialCatalog: CasinoGamesCatalog;
  defaultPageTitle?: string;
  /** Hide category row and ignore `?category=` (e.g. live casino lobby). */
  showCategoryStrip?: boolean;
  /** Passed to `CasinoCategoryStrip` (default `/casino-games`). */
  categoryStripLobbyPath?: string;
  /** Hub category slug for plain lobby URL (default `casino-games`). */
  categoryStripHubSlug?: string;
  /**
   * Live lobby tabs: `live-games` = all, `supernowa` = provider, `roulette` / `baccarat` = name match.
   * Default catalog uses `game.categoryIds` only.
   */
  liveCategoryFiltering?: boolean;
};

const REMOTE_GAME_CDN_PLACEHOLDER =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhAQMAAABIshroAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAB1JREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAGiJHAAHrw0NSAAAAAElFTkSuQmCC';

function withLocalGameThumbnails(games: CasinoGameRecord[]): CasinoGameRecord[] {
  if (FEATURES.remoteGameCdnImages) return games;
  return games.map((g) =>
    /^https?:\/\//i.test(g.thumbnailUrl) ? { ...g, thumbnailUrl: REMOTE_GAME_CDN_PLACEHOLDER } : g
  );
}

const CATEGORY_FILTER_IDS: Record<string, readonly string[]> = {
  'virtual-games': ['virtual-games', 'virtual-sports'],
};

function gameMatchesCategorySlug(g: CasinoGameRecord, slug: string): boolean {
  const ids = g.categoryIds || [];
  const allowed = new Set<string>([slug, ...(CATEGORY_FILTER_IDS[slug] ?? [])]);
  return ids.some((id) => allowed.has(id));
}

function gameMatchesLiveCategorySlug(g: CasinoGameRecord, slug: string): boolean {
  switch (slug) {
    case 'live-games':
      return true;
    case 'supernowa':
      return (g.providerSlug || '').toLowerCase() === 'supernowa';
    case 'roulette':
      return /roulette/i.test(g.name);
    case 'baccarat':
      return /baccarat/i.test(g.name);
    default:
      return gameMatchesCategorySlug(g, slug);
  }
}

function filterGames(
  games: CasinoGameRecord[],
  categorySlug: string,
  providerSlug: string,
  q: string,
  applyCategory: boolean,
  liveCategoryFiltering: boolean
): CasinoGameRecord[] {
  let out = games;
  if (applyCategory && categorySlug) {
    out = out.filter((g) =>
      liveCategoryFiltering
        ? gameMatchesLiveCategorySlug(g, categorySlug)
        : gameMatchesCategorySlug(g, categorySlug)
    );
  }
  if (providerSlug) {
    out = out.filter((g) => (g.providerSlug || '').toLowerCase() === providerSlug.toLowerCase());
  }
  const t = q.trim().toLowerCase();
  if (t) {
    out = out.filter(
      (g) =>
        g.name.toLowerCase().includes(t) ||
        g.id.toLowerCase().includes(t) ||
        g.provider.toLowerCase().includes(t)
    );
  }
  return out;
}

type BodyProps = CasinoGamesPageProps & {
  categorySlug: string;
};

function CasinoGamesPageBody({
  initialCatalog,
  defaultPageTitle = 'Casino Games',
  showCategoryStrip = true,
  categorySlug,
  categoryStripLobbyPath,
  categoryStripHubSlug,
  liveCategoryFiltering = false,
}: BodyProps) {
  const { isLoggedIn } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [selectedProviderSlug, setSelectedProviderSlug] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const catalog = initialCatalog;
  const applyCategory = showCategoryStrip;

  const gamesForView = useMemo(
    () => withLocalGameThumbnails(catalog.games),
    [catalog.games]
  );

  const handleSearchInputChange = useCallback((q: string) => {
    setSearchInput(q);
    if (q.trim() === '') {
      setAppliedQuery('');
    }
  }, []);

  const filteredGames = useMemo(
    () =>
      filterGames(
        gamesForView,
        categorySlug,
        selectedProviderSlug,
        appliedQuery,
        applyCategory,
        liveCategoryFiltering
      ),
    [
      gamesForView,
      categorySlug,
      selectedProviderSlug,
      appliedQuery,
      applyCategory,
      liveCategoryFiltering,
    ]
  );

  const gridTitle = useMemo(() => {
    if (!applyCategory || !categorySlug) return catalog.pageTitle ?? defaultPageTitle;
    const cat = catalog.categories.find((c) => c.slug === categorySlug || c.id === categorySlug);
    return cat?.label ?? catalog.pageTitle ?? defaultPageTitle;
  }, [applyCategory, catalog.categories, catalog.pageTitle, categorySlug, defaultPageTitle]);

  const handleDemoLogin = useCallback(async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', APP_CONFIG.DEMO_USERNAME);
      formData.append('password', APP_CONFIG.DEMO_USER_PASSWORD);
      const res = await fetch(`${APP_CONFIG.BASE_URL}user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      const data = await res.json();
      if (!data.error) {
        window.location.href = decodeURIComponent(data.redirect);
      }
    } catch {
      // ignore
    }
  }, []);

  const onPlayClick = useCallback((game: CasinoGameRecord) => {
    const href = game.playHref?.trim() || '#';
    if (href === '#' || href === '') {
      setShowLogin(true);
      return;
    }
    window.location.href = href;
  }, []);

  const providers = catalog.providers;
  const categories = catalog.categories;

  return (
    <main className="casino-page-main">
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowSignup(true)}
        onDemoLogin={handleDemoLogin}
      />

      <LoginModal show={showLogin} onClose={() => setShowLogin(false)} onLoginSuccess={() => setShowLogin(false)} />
      <SignupModal show={showSignup} onClose={() => setShowSignup(false)} />

      <div className="container-fluid container-fluid1 casino_top">
        <div className="casino_page_topsection">
          <CasinoGamesToolbar
            providers={providers}
            selectedProviderSlug={selectedProviderSlug}
            onProviderChange={setSelectedProviderSlug}
            searchQuery={searchInput}
            onSearchQueryChange={handleSearchInputChange}
            onSearchSubmit={() => setAppliedQuery(searchInput.trim())}
          />
          {showCategoryStrip ? (
            <CasinoCategoryStrip
              categories={categories}
              activeCategorySlug={categorySlug}
              lobbyPath={categoryStripLobbyPath}
              hubSlug={categoryStripHubSlug}
            />
          ) : null}
        </div>
      </div>
      <div className={showCategoryStrip ? 'casino-lobby-with-category-strip' : undefined}>
        <CasinoGameGrid
          title={gridTitle}
          games={filteredGames}
          onPlayClick={onPlayClick}
          showGuestLoginCue={!isLoggedIn}
        />
      </div>

      <Footer />
    </main>
  );
}

function CasinoGamesPageWithSearchParams(props: CasinoGamesPageProps) {
  const searchParams = useSearchParams();
  const showStrip = props.showCategoryStrip !== false;
  const raw = searchParams.get('category')?.trim() || '';
  const categorySlug = showStrip ? raw : '';
  return <CasinoGamesPageBody {...props} categorySlug={categorySlug} />;
}

export default function CasinoGamesPage(props: CasinoGamesPageProps) {
  const showStrip = props.showCategoryStrip !== false;
  return (
    <Suspense
      fallback={
        <CasinoGamesPageBody {...props} categorySlug="" showCategoryStrip={showStrip} />
      }
    >
      <CasinoGamesPageWithSearchParams {...props} />
    </Suspense>
  );
}
