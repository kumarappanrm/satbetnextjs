/**
 * Builds `public/data/live-casino-games.json` from `casino-games.json`
 * by keeping games whose provider matches the live-casino toolbar on Satbet
 * (see `live_casino_games_files/live casino games.html`).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcPath = path.join(root, 'public', 'data', 'casino-games.json');
const outPath = path.join(root, 'public', 'data', 'live-casino-games.json');

const LIVE_PROVIDER_SLUGS = new Set([
  'supernowa',
  'qtech',
  'jili',
  '7-mojo',
  'dream-casino',
  'ezugi',
  'evolution',
  'mac88',
  'jacktop',
  'aman-casino',
  'awc',
  'tvbet',
  'xprogaming',
  'marbles',
  'ngp',
]);

const LIVE_CATEGORIES = [
  {
    id: 'live-games',
    slug: 'live-games',
    label: 'Live Games',
    routePath: '/live-games',
  },
  {
    id: 'supernowa',
    slug: 'supernowa',
    label: 'Supernowa',
    routePath: '/supernowa',
  },
  {
    id: 'roulette',
    slug: 'roulette',
    label: 'Roulette',
    routePath: '/roulette',
  },
  {
    id: 'baccarat',
    slug: 'baccarat',
    label: 'Baccarat',
    routePath: '/baccarat',
  },
];

function main() {
  const raw = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  const games = (raw.games || []).filter(
    (g) => g.providerSlug && LIVE_PROVIDER_SLUGS.has(String(g.providerSlug).toLowerCase())
  );
  const slugs = new Set(games.map((g) => g.providerSlug).filter(Boolean));
  const allRow = { label: 'All Game Providers', slug: '' };
  const rest = (raw.providers || []).filter((p) => p.slug && slugs.has(p.slug));
  const providers = [allRow, ...rest];

  const out = {
    version: raw.version ?? 2,
    pageTitle: 'Live Casino Games',
    categories: LIVE_CATEGORIES,
    providers,
    games,
  };

  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${outPath} (${games.length} games, ${providers.length - 1} providers)`);
}

main();
