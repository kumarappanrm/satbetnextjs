import type { Metadata } from 'next';
import LiveCasinoGamesPage from '@/components/pages/LiveCasinoGamesPage';
import { loadLiveCasinoCatalogFromDisk } from '@/lib/loadLiveCasinoCatalog.server';

export const metadata: Metadata = {
  title: 'Live Casino Games',
  description:
    'SatBet live casino games streamed in real time — browse by category, provider, and search.',
};

export default function Page() {
  const initialCatalog = loadLiveCasinoCatalogFromDisk();
  return <LiveCasinoGamesPage initialCatalog={initialCatalog} />;
}
