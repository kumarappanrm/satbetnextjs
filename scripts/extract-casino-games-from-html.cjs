/**
 * One-off: extract games from saved casino-games.html → stdout as JSON array.
 * Run: node scripts/extract-casino-games-from-html.cjs > tmp-games.json
 */
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'casino-games_files', 'casino-games.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const blocks = html.split('single-download-box');
const games = [];

for (const b of blocks) {
  const idm = b.match(/data-game-id="([^"]+)"/);
  if (!idm) continue;
  const srcm =
    b.match(/data-src="(https:[^"]+)"/) ||
    b.match(/<img[^>]+src="(https:[^"]+)"/);
  const provm = b.match(/game-name boxed-btn"[^>]*data-provider="([^"]*)"/);
  const namem = b.match(/game-name[^]*?<a[^>]*>([^<]*)<\/a>/);
  if (!namem) continue;
  games.push({
    id: idm[1],
    name: namem[1].trim(),
    provider: provm ? provm[1] || 'UNKNOWN' : 'UNKNOWN',
    thumbnailUrl: srcm ? srcm[1] : '',
  });
}

const outPath = process.argv[2];
if (outPath) {
  fs.writeFileSync(outPath, JSON.stringify(games, null, 2), 'utf8');
  console.error('wrote', games.length, 'games →', outPath);
} else {
  console.log(JSON.stringify(games, null, 2));
  console.error('extracted', games.length, 'games');
}
