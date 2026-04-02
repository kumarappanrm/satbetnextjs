/**
 * Merges legacy main + Bootstrap into one minified file (one HTTP request instead of two).
 * Swiper styles come from the `swiper` npm package (bundled with the app JS).
 */
const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

const root = path.join(__dirname, '..');
const assetsDir = path.join(root, 'public', 'assets');
const inputs = [
  path.join(assetsDir, '1954F84B-style.css'),
  path.join(assetsDir, 'D635E54B-bootstrap.min.css'),
];
const outFile = path.join(assetsDir, 'vendor.app.min.css');

let combined = '';
for (const file of inputs) {
  if (!fs.existsSync(file)) {
    console.error('Missing:', file);
    process.exit(1);
  }
  combined += fs.readFileSync(file, 'utf8') + '\n';
}

const result = new CleanCSS({ level: 2 }).minify(combined);
if (result.errors && result.errors.length) {
  console.warn('clean-css errors:', result.errors);
}
fs.writeFileSync(outFile, result.styles);
console.log(
  'vendor CSS →',
  path.relative(root, outFile),
  `(${(result.styles.length / 1024).toFixed(1)} KB minified)`
);
