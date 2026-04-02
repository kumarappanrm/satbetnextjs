import fs from 'fs';
import path from 'path';
import { normalizeCasinoGamesCatalog } from '@/lib/casinoGamesData';
import type { CasinoGamesCatalog } from '@/types/casino-games';

/** Read `public/data/casino-games.json` at build / request time (server only). */
export function loadCasinoGamesCatalogFromDisk(): CasinoGamesCatalog {
  const filePath = path.join(process.cwd(), 'public', 'data', 'casino-games.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  return normalizeCasinoGamesCatalog(JSON.parse(raw));
}
