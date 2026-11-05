import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

test('Single unified extension manifest has themes, icons, settings, eager activation, and flat conditional keybindings', () => {
  const uiPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'jetbrains-intellij-new-ui-pro/package.json'), 'utf8'));
  assert.equal(uiPkg.name, 'jetbrains-intellij-new-ui-pro');
  assert.equal(uiPkg.displayName, 'IntelliJ IDEA New UI (Pro)');
  assert.equal(uiPkg.publisher, 'elaand');
  assert.equal(uiPkg.version, '1.2.0', 'Version must be bumped to 1.2.0 to invalidate IDE manifest cache');
  assert.ok(uiPkg.activationEvents.includes('*'), 'Must activate eagerly with "*" so keymap context and project detection run at 0ms');
  assert.equal(uiPkg.contributes.configurationDefaults, undefined, 'configurationDefaults must not be hardcoded in package.json so non-Java projects are unaffected');

  assert.equal(uiPkg.contributes.themes.length, 2, 'Must contribute both Dark and Light themes');
  assert.deepEqual(uiPkg.contributes.themes[0], {
    id: 'IntelliJ IDEA New UI Dark (Pro)',
    label: 'IntelliJ IDEA New UI Dark (Pro)',
    uiTheme: 'vs-dark',
    path: './themes/intellij-new-ui-dark-pro.json'
  });
  assert.deepEqual(uiPkg.contributes.themes[1], {
    id: 'IntelliJ IDEA New UI Light (Pro)',
    label: 'IntelliJ IDEA New UI Light (Pro)',
    uiTheme: 'vs',
    path: './themes/intellij-new-ui-light-pro.json'
  });
  assert.equal(uiPkg.contributes.iconThemes[0].id, 'intellij-new-ui-file-icons');
  assert.equal(uiPkg.contributes.iconThemes[0].path, './icons/file-icons/intellij-new-ui-file-icons.json');
  assert.equal(uiPkg.contributes.productIconThemes[0].id, 'intellij-new-ui-product-icons');
  assert.equal(uiPkg.contributes.productIconThemes[0].path, './icons/product-icons/intellij-new-ui-product-icons.json');

  // Settings UI properties (enableKeymap & onlyApplyInJavaProjects)
  const props = uiPkg.contributes.configuration?.properties;
  assert.ok(props, 'contributes.configuration.properties must exist');
  assert.equal(props['intellijNewUi.enableKeymap']?.type, 'boolean');
  assert.equal(props['intellijNewUi.enableKeymap']?.default, true);
  assert.equal(props['intellijNewUi.onlyApplyInJavaProjects']?.type, 'boolean');
  assert.equal(props['intellijNewUi.onlyApplyInJavaProjects']?.default, false);

  // Merged keybindings with flat && when-clauses (no || or parentheses)
  const keybindings = uiPkg.contributes.keybindings;
  assert.ok(Array.isArray(keybindings) && keybindings.length >= 34, 'Keybindings must be merged into main extension');
  for (const kb of keybindings) {
    assert.match(kb.when || '', /config\.intellijNewUi\.enableKeymap/, `Keybinding ${kb.key} must respect config.intellijNewUi.enableKeymap`);
    assert.match(kb.when || '', /!intellijNewUi\.disabledInThisWindow/, `Keybinding ${kb.key} must respect !intellijNewUi.disabledInThisWindow`);
    assert.ok(!kb.when.includes('||') && !kb.when.includes('('), `Keybinding ${kb.key} when-clause must be flat && without parentheses`);
  }

  // Must not override user's custom ctrl+i or ctrl+1 AI chat shortcuts
  const forbiddenKeys = keybindings.filter(
    k => ['ctrl+i', 'ctrl+1'].includes(String(k.key).toLowerCase())
  );
  assert.equal(forbiddenKeys.length, 0, 'Keymap must not override ctrl+i or ctrl+1');
});
