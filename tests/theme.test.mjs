import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const THEME_PATH = 'C:/Users/ADMIN/.antigravity-extensions-src/jetbrains-intellij-new-ui-dark/themes/intellij-new-ui-dark-pro.json';

test('Color theme matches exact JetBrains New UI Dark palette and Java/TS semantic tokens', () => {
  const theme = JSON.parse(fs.readFileSync(THEME_PATH, 'utf8'));
  assert.equal(theme.type, 'dark');
  assert.equal(theme.semanticHighlighting, true);

  // Core surfaces
  assert.equal(theme.colors['editor.background'].toUpperCase(), '#1E1F22');
  assert.equal(theme.colors['sideBar.background'].toUpperCase(), '#2B2D30');
  assert.equal(theme.colors['activityBar.background'].toUpperCase(), '#2B2D30');
  assert.equal(theme.colors['statusBar.background'].toUpperCase(), '#2B2D30');
  assert.equal(theme.colors['terminal.background'].toUpperCase(), '#1E1F22');
  assert.equal(theme.colors['focusBorder'].toUpperCase(), '#3574F0');
  assert.equal(theme.colors['list.activeSelectionBackground'].toUpperCase(), '#2E436E');
  assert.equal(theme.colors['editor.selectionBackground'].toUpperCase(), '#214283');
  assert.equal(theme.colors['editor.lineHighlightBackground'].toUpperCase(), '#26282E');
  assert.ok(Object.keys(theme.colors).length >= 320, `Must cover >= 320 workbench color keys, got ${Object.keys(theme.colors).length}`);

  // Semantic tokens for Java/Spring & TS
  const sem = theme.semanticTokenColors;
  assert.equal(sem['annotation'].foreground.toUpperCase(), '#B3AE60');
  assert.equal(sem['decorator'].foreground.toUpperCase(), '#B3AE60');
  assert.equal(sem['method.declaration'].foreground.toUpperCase(), '#56A8F5');
  assert.equal(sem['function.declaration'].foreground.toUpperCase(), '#56A8F5');
  assert.equal(sem['property'].foreground.toUpperCase(), '#C77DBB');
  assert.equal(sem['property.static'].foreground.toUpperCase(), '#C77DBB');
  assert.equal(sem['property.static'].fontStyle, 'italic');
  assert.equal(sem['enumMember'].foreground.toUpperCase(), '#C77DBB');
  assert.equal(sem['enumMember'].fontStyle, 'italic');
  assert.equal(sem['typeParameter'].foreground.toUpperCase(), '#507874');
  assert.equal(sem['method.static'].fontStyle, 'italic');
});

