import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const PROD_DIR = 'C:/Users/ADMIN/.antigravity-extensions-src/jetbrains-intellij-new-ui-dark/icons/product-icons';
const JSON_PATH = path.join(PROD_DIR, 'intellij-new-ui-product-icons.json');

test('Product icon theme defines valid WOFF font and maps core IDE toolbar/action icons', () => {
  const theme = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  assert.equal(theme.fonts[0].id, 'intellij-expui-icons');
  const fontPath = path.resolve(PROD_DIR, theme.fonts[0].src[0].path);
  assert.ok(fs.existsSync(fontPath), 'WOFF font file must exist');

  const buf = fs.readFileSync(fontPath);
  assert.equal(buf.toString('ascii', 0, 4), 'wOFF', 'Font file must have valid wOFF magic header');
  assert.ok(buf.length > 2000, `Font file must contain vector glyph outlines, got ${buf.length} bytes`);

  const requiredIcons = [
    'run', 'debug-start', 'debug', 'bug', 'debug-stop', 'debug-restart',
    'debug-step-over', 'debug-step-into', 'debug-step-out', 'debug-pause',
    'search', 'replace', 'filter', 'refresh', 'collapse-all', 'expand-all',
    'close', 'add', 'trash', 'edit', 'settings-gear', 'more', 'kebab-vertical',
    'chevron-right', 'chevron-down', 'chevron-up', 'chevron-left',
    'folder', 'folder-opened', 'file', 'source-control', 'git-branch',
    'git-commit', 'git-pull-request', 'git-merge', 'discard', 'history', 'sync',
    'terminal', 'output', 'error', 'warning', 'info', 'bell',
    'split-horizontal', 'split-vertical'
  ];

  for (const iconId of requiredIcons) {
    assert.ok(theme.iconDefinitions[iconId], `Missing product icon mapping for ${iconId}`);
    assert.match(theme.iconDefinitions[iconId].fontCharacter, /^\\e0[0-9a-f]{2}$/i);
  }
});

