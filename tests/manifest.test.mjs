import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'C:/Users/ADMIN/.antigravity-extensions-src';

test('Extension manifests have required IntelliJ New UI contributions and commands', () => {
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
  assert.equal(uiPkg.contributes.configurationDefaults['editor.fontFamily'], "'JetBrains Mono', Consolas, monospace");
  assert.equal(uiPkg.contributes.configurationDefaults['editor.fontSize'], 13.5);
  assert.equal(uiPkg.contributes.configurationDefaults['editor.lineHeight'], 1.6);
  assert.equal(uiPkg.contributes.configurationDefaults['editor.letterSpacing'], 0.3);
  assert.equal(uiPkg.contributes.configurationDefaults['editor.minimap.autohide'], 'mouseover');
  assert.equal(uiPkg.contributes.configurationDefaults['workbench.editor.customLabels.enabled'], true);
  assert.deepEqual(uiPkg.contributes.configurationDefaults['workbench.editor.customLabels.patterns'], { '**/*.java': '${filename}' });
  assert.equal(uiPkg.contributes.configurationDefaults['cSpell.enabled'], false);
  assert.equal(uiPkg.contributes.configurationDefaults['editor.semanticHighlighting.enabled'], true);

  const keymapPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'jetbrains-intellij-keymap/package.json'), 'utf8'));
  assert.equal(keymapPkg.name, 'jetbrains-intellij-keymap');
  assert.equal(keymapPkg.publisher, 'elaand');
  assert.ok(Array.isArray(keymapPkg.contributes.keybindings));
  assert.ok(keymapPkg.contributes.keybindings.length >= 34);

  // Review Focus #2: Do not hijack user's custom ctrl+i or ctrl+1 AI chat shortcuts
  const forbiddenKeys = keymapPkg.contributes.keybindings.filter(
    k => ['ctrl+i', 'ctrl+1'].includes(String(k.key).toLowerCase())
  );
  assert.equal(forbiddenKeys.length, 0, 'Keymap must not override ctrl+i or ctrl+1');
});

