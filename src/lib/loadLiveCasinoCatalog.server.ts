import fs from 'fs';
import path from 'path';
import { normalizeCasinoGamesCatalog } from '@/lib/casinoGamesData';
import type { CasinoGamesCatalog } from '@/types/casino-games';

/** Read `public/data/live-casino-games.json` (server only). */
export function loadLiveCasinoCatalogFromDisk(): CasinoGamesCatalog {
  const filePath = path.join(process.cwd(), 'public', 'data', 'live-casino-games.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  return normalizeCasinoGamesCatalog(JSON.parse(raw));
}
