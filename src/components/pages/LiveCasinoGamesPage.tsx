'use client';

import React from 'react';
import CasinoGamesPage from '@/components/pages/CasinoGamesPage';
import type { CasinoGamesCatalog } from '@/types/casino-games';

type Props = {
  initialCatalog: CasinoGamesCatalog;
};

export default function LiveCasinoGamesPage({ initialCatalog }: Props) {
  return (
    <CasinoGamesPage
      initialCatalog={initialCatalog}
      defaultPageTitle="Live Casino Games"
      showCategoryStrip
      categoryStripLobbyPath="/live-casino-games"
      categoryStripHubSlug="live-games"
      liveCategoryFiltering
    />
  );
}
