import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'C:/Users/ADMIN/.antigravity-extensions-src';

test('Single unified extension manifest has themes, icons, settings, and conditional keybindings', () => {
  const uiPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'jetbrains-intellij-new-ui-dark/package.json'), 'utf8'));
  assert.equal(uiPkg.name, 'jetbrains-intellij-new-ui-dark');
  assert.equal(uiPkg.publisher, 'elaand');
  assert.equal(uiPkg.contributes.themes[0].label, 'IntelliJ IDEA New UI Dark (Pro)');
  assert.equal(
    uiPkg.contributes.themes[0].id ?? uiPkg.contributes.themes[0].label,
    'IntelliJ IDEA New UI Dark (Pro)',
    'Theme id (if present) must exactly match the workbench.colorTheme setting value'
  );
  assert.equal(uiPkg.contributes.themes[0].path, './themes/intellij-new-ui-dark-pro.json');
  assert.equal(uiPkg.contributes.iconThemes[0].id, 'intellij-new-ui-file-icons');
  assert.equal(uiPkg.contributes.iconThemes[0].path, './icons/file-icons/intellij-new-ui-file-icons.json');
  assert.equal(uiPkg.contributes.productIconThemes[0].id, 'intellij-new-ui-product-icons');
  assert.equal(uiPkg.contributes.productIconThemes[0].path, './icons/product-icons/intellij-new-ui-product-icons.json');

  // Typography & Editor defaults
  assert.equal(uiPkg.contributes.configurationDefaults['editor.fontFamily'], "'JetBrains Mono', Consolas, monospace");
  assert.equal(uiPkg.contributes.configurationDefaults['editor.fontSize'], 13.5);
  assert.equal(uiPkg.contributes.configurationDefaults['editor.lineHeight'], 1.6);
  assert.equal(uiPkg.contributes.configurationDefaults['editor.letterSpacing'], 0.3);
  assert.equal(uiPkg.contributes.configurationDefaults['editor.minimap.autohide'], 'mouseover');
  assert.equal(uiPkg.contributes.configurationDefaults['workbench.editor.customLabels.enabled'], true);
  assert.deepEqual(uiPkg.contributes.configurationDefaults['workbench.editor.customLabels.patterns'], { '**/*.java': '${filename}' });
  assert.equal(uiPkg.contributes.configurationDefaults['cSpell.enabled'], false);
  assert.equal(uiPkg.contributes.configurationDefaults['editor.semanticHighlighting.enabled'], true);

  // Settings UI properties (enableKeymap & onlyApplyInJavaProjects)
  const props = uiPkg.contributes.configuration?.properties;
  assert.ok(props, 'contributes.configuration.properties must exist');
  assert.equal(props['intellijNewUi.enableKeymap']?.type, 'boolean');
  assert.equal(props['intellijNewUi.enableKeymap']?.default, true);
  assert.equal(props['intellijNewUi.onlyApplyInJavaProjects']?.type, 'boolean');
  assert.equal(props['intellijNewUi.onlyApplyInJavaProjects']?.default, false);

  // Merged keybindings with zero-overhead when-clauses
  const keybindings = uiPkg.contributes.keybindings;
  assert.ok(Array.isArray(keybindings) && keybindings.length >= 34, 'Keybindings must be merged into main extension');
  for (const kb of keybindings) {
    assert.match(kb.when || '', /config\.intellijNewUi\.enableKeymap/, `Keybinding ${kb.key} must respect config.intellijNewUi.enableKeymap`);
    assert.match(kb.when || '', /intellijNewUi\.isJavaProject/, `Keybinding ${kb.key} must respect Java project condition`);
  }

  // Must not override user's custom ctrl+i or ctrl+1 AI chat shortcuts
  const forbiddenKeys = keybindings.filter(
    k => ['ctrl+i', 'ctrl+1'].includes(String(k.key).toLowerCase())
  );
  assert.equal(forbiddenKeys.length, 0, 'Keymap must not override ctrl+i or ctrl+1');
});
