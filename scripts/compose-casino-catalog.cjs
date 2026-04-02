/**
 * Builds public/data/casino-games.json from public/tmp-raw-games.json (run extract script first).
 * npm run catalog:compose
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const rawPath = path.join(root, 'public', 'tmp-raw-games.json');
const outPath = path.join(root, 'public', 'data', 'casino-games.json');

const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

const THUMB_FOLDER_TO_PROVIDER_SLUG = {
  supernowagames: 'supernowa',
  qtgames: 'qtech',
  dtgames: 'dream-casino',
  nektangames: 'nektan',
  skygapgames: 'gamefishglobal',
};

const PROVIDER_LABEL_TO_SLUG = {
  SUPERNOWA: 'supernowa',
  QT: 'qtech',
  WACS: 'gamefishglobal',
  BLAZE: 'blaze',
  NAKTHAN: 'ngp',
  UNKNOWN: '',
};

function inferProviderSlug(thumbnailUrl, dataProvider, gameId) {
  const fromAttr = PROVIDER_LABEL_TO_SLUG[dataProvider];
  if (fromAttr && fromAttr !== '') return fromAttr;
  try {
    if (thumbnailUrl) {
      const u = new URL(thumbnailUrl);
      const folder = u.pathname.split('/').filter(Boolean)[0];
      if (folder && THUMB_FOLDER_TO_PROVIDER_SLUG[folder]) {
        return THUMB_FOLDER_TO_PROVIDER_SLUG[folder];
      }
    }
  } catch (_) {}
  if (/^\d+$/.test(String(gameId))) return 'supernowa';
  return 'pragmaticplay';
}

function displayProvider(slug, fallback) {
  const labels = {
    supernowa: 'SUPERNOWA',
    qtech: 'QT',
    'dream-casino': 'DREAM CASINO',
    nektan: 'NEKTAN',
    gamefishglobal: 'GAMEFISH',
    pragmaticplay: 'PRAGMATIC',
    blaze: 'BLAZE',
    ngp: 'NGP',
  };
  if (fallback && fallback !== 'UNKNOWN') return fallback;
  return labels[slug] || slug.toUpperCase();
}

function inferCategoryIds(name) {
  const n = String(name).toLowerCase();
  const ids = [];
  if (/\bkeno\b/.test(n)) ids.push('keno');
  if (/\bbingo games\b|bingo bash/.test(n)) ids.push('bingo-games');
  else if (/\bbingo\b|super sixer/.test(n)) ids.push('bingo');
  if (/fish|fishing|big bass|ocean|catch/.test(n)) ids.push('fishing-games');
  if (/scratch/.test(n)) ids.push('scratch-games');
  if (
    /roulette|blackjack|baccarat|poker|andar|teen patti|sic bo|dragon tiger|hold'em|holdem|caribbean/.test(n)
  ) {
    ids.push('table-games');
  }
  if (/virtual|football ?x|cricket ?x|race|derby/.test(n)) ids.push('virtual-games');
  if (/draw|lottery|lotto|mega\s*millions/.test(n)) ids.push('draw-games');
  if (
    /\bevolution\b|lightning|crazy time|monopoly live|deal or no deal|immersive|megaball/.test(n)
  ) {
    ids.push('evolution-games');
  }
  if (/\blive\b/.test(n) && /roulette|blackjack|baccarat|poker|hold|sic|dragon|teen|andar/.test(n)) {
    ids.push('live-games');
  }
  if (/trending|hot\s*slot|fire\s*strike|vip vault|space ball/.test(n)) ids.push('trending');
  if (
    /slot|reels|megaways|bonanza|book of|sweet|candy|fruity|gems|wild|spin|jackpot|mines|aviator|jet|balloon|crash|plinko/.test(n)
  ) {
    ids.push('slot-games');
  }
  if (ids.length === 0) ids.push('casino-games');
  return [...new Set(ids)];
}

function normalizeThumb(url, gameId) {
  if (url) {
    return url.replace('https://qa.bollytech.com/', 'https://prod.bollytech.com/');
  }
  const id = encodeURIComponent(gameId);
  if (/^\d+$/.test(String(gameId))) {
    return `https://prod.bollytech.com/supernowagames/images/${id}.jpg`;
  }
  return `https://prod.bollytech.com/supernowagames/images/${id}.jpg`;
}

const providers = [
  { label: 'All Game Providers', slug: '' },
  { label: 'Qtech', slug: 'qtech' },
  { label: 'Supernowa', slug: 'supernowa' },
  { label: '7 Mojo', slug: '7-mojo' },
  { label: 'Dream Casino', slug: 'dream-casino' },
  { label: 'Ngp', slug: 'ngp' },
  { label: 'Jili', slug: 'jili' },
  { label: 'Smartsoft', slug: 'smartsoft' },
  { label: 'Evoslot', slug: 'evoslot' },
  { label: 'Powergame', slug: 'powergame' },
  { label: 'Only Play', slug: 'only-play' },
  { label: 'One Touch', slug: 'one-touch' },
  { label: 'Powergames', slug: 'powergames' },
  { label: 'Play N Go', slug: 'play-n-go' },
  { label: 'Spinmatic', slug: 'spinmatic' },
  { label: 'Booongo', slug: 'booongo' },
  { label: 'Blueprint', slug: 'blueprint' },
  { label: 'Elk Studios', slug: 'elk-studios' },
  { label: 'Evoplay', slug: 'evoplay' },
  { label: 'Nolimit City', slug: 'nolimit-city' },
  { label: 'Quickspin', slug: 'quickspin' },
  { label: 'Gamefishglobal', slug: 'gamefishglobal' },
  { label: 'Pragmatic Play', slug: 'pragmaticplay' },
  { label: '1x2 Gaming', slug: '1x2-gaming' },
  { label: 'Booming', slug: 'booming' },
  { label: 'Spinominal', slug: 'spinominal' },
  { label: 'Ortiz', slug: 'ortiz' },
  { label: 'Gameart', slug: 'gameart' },
  { label: 'Playson', slug: 'playson' },
  { label: 'Blaze', slug: 'blaze' },
  { label: 'Nektan', slug: 'nektan' },
  { label: 'Habanero', slug: 'habanero' },
];

const categories = [
  {
    id: 'slot-games',
    slug: 'slot-games',
    label: 'Slot games',
    iconSrc: '/assets/casino-categories/slot-games.png',
    routePath: '/slot-games',
  },
  {
    id: 'draw-games',
    slug: 'draw-games',
    label: 'Draw games',
    iconSrc: '/assets/casino-categories/draw-games.png',
    routePath: '/draw-games',
  },
  {
    id: 'table-games',
    slug: 'table-games',
    label: 'Table games',
    iconSrc: '/assets/casino-categories/table-games.png',
    routePath: '/table-games',
  },
  {
    id: 'bingo',
    slug: 'bingo',
    label: 'Bingo',
    iconSrc: '/assets/casino-categories/bingo.png',
    routePath: '/bingo',
  },
  {
    id: 'casino-games',
    slug: 'casino-games',
    label: 'Casino-games',
    iconSrc: '/assets/casino-categories/casino-games.png',
    routePath: '/casino-games',
  },
  {
    id: 'scratch-games',
    slug: 'scratch-games',
    label: 'Scratch games',
    iconSrc: '/assets/casino-categories/scratch-games.png',
    routePath: '/scratch-games',
  },
  {
    id: 'virtual-games',
    slug: 'virtual-games',
    label: 'Virtual games',
    iconSrc: '/assets/casino-categories/virtual-games.png',
    routePath: '/virtual-games',
  },
  {
    id: 'bingo-games',
    slug: 'bingo-games',
    label: 'Bingo games',
    iconSrc: '/assets/casino-categories/bingo-games.png',
    routePath: '/bingo-games',
  },
  {
    id: 'evolution-games',
    slug: 'evolution-games',
    label: 'Evolution games',
    iconSrc: '/assets/casino-categories/evolution-games.png',
    routePath: '/evolution-games',
  },
  {
    id: 'live-games',
    slug: 'live-games',
    label: 'Live games',
    iconSrc: '/assets/casino-categories/live-games.png',
    routePath: '/live-games',
  },
  {
    id: 'trending',
    slug: 'trending',
    label: 'Trending',
    iconSrc: '/assets/casino-categories/trending.png',
    routePath: '/trending',
  },
  {
    id: 'new-games',
    slug: 'new-games',
    label: 'New games',
    iconSrc: '/assets/casino-categories/new-games.png',
    routePath: '/new-games',
  },
];

const games = raw.map((row) => {
  const providerSlug = inferProviderSlug(row.thumbnailUrl, row.provider, row.id);
  const thumbnailUrl = normalizeThumb(row.thumbnailUrl, row.id);
  return {
    id: row.id,
    name: row.name,
    provider: displayProvider(providerSlug, row.provider),
    providerSlug,
    categoryIds: inferCategoryIds(row.name),
    thumbnailUrl,
    playHref: '#',
  };
});

const catalog = {
  version: 2,
  pageTitle: 'Casino Games',
  categories,
  providers,
  games,
};

fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2), 'utf8');
console.error('wrote', games.length, 'games,', providers.length, 'providers,', categories.length, 'categories →', path.relative(root, outPath));
