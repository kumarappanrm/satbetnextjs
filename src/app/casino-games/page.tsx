import type { Metadata } from 'next';
import CasinoGamesPage from '@/components/pages/CasinoGamesPage';
import { loadCasinoGamesCatalogFromDisk } from '@/lib/loadCasinoCatalog.server';

export const metadata: Metadata = {
  title: 'Casino Games',
  description: 'Browse casino games by provider. Search and play your favorites.',
};

export default function Page() {
  const initialCatalog = loadCasinoGamesCatalogFromDisk();
  return <CasinoGamesPage initialCatalog={initialCatalog} />;
}
