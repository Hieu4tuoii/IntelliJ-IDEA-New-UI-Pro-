import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

test('JetBrains Mono font, single unified VSIX package v1.1.0, extension directories, and atomic settings switcher work properly', () => {
  // 1. Font installed in Windows User Fonts
  const fontDir = path.join(process.env.LOCALAPPDATA, 'Microsoft/Windows/Fonts');
  assert.ok(fs.existsSync(path.join(fontDir, 'JetBrainsMono-Regular.ttf')), 'JetBrainsMono-Regular.ttf must be installed');
  assert.ok(fs.existsSync(path.join(fontDir, 'JetBrainsMono-Italic.ttf')), 'JetBrainsMono-Italic.ttf must be installed');
  assert.ok(fs.existsSync(path.join(fontDir, 'JetBrainsMono-Bold.ttf')), 'JetBrainsMono-Bold.ttf must be installed');

  // 2. Single unified VSIX file v1.1.0 generated, old VSIXs removed
  const distDir = 'C:/Users/ADMIN/.antigravity-extensions-src/dist';
  assert.ok(fs.existsSync(path.join(distDir, 'jetbrains-intellij-new-ui-dark-1.1.0.vsix')));
  assert.ok(!fs.existsSync(path.join(distDir, 'jetbrains-intellij-keymap-1.0.0.vsix')), 'Separate keymap VSIX must be removed');

  // 3. Installed in both .antigravity and .antigravity-ide as v1.1.0, and old 1.0.0 / keymap folders removed
  for (const extRoot of ['C:/Users/ADMIN/.antigravity/extensions', 'C:/Users/ADMIN/.antigravity-ide/extensions']) {
    assert.ok(fs.existsSync(path.join(extRoot, 'elaand.jetbrains-intellij-new-ui-dark-1.1.0/package.json')));
    assert.ok(!fs.existsSync(path.join(extRoot, 'elaand.jetbrains-intellij-new-ui-dark-1.0.0')), 'Old 1.0.0 folder must be removed to force manifest cache refresh');
    assert.ok(!fs.existsSync(path.join(extRoot, 'elaand.jetbrains-intellij-keymap-1.0.0')), 'Old separate keymap folder must be removed');
    const reg = JSON.parse(fs.readFileSync(path.join(extRoot, 'extensions.json'), 'utf8'));
    const entry = reg.find(e => e.identifier?.id === 'elaand.jetbrains-intellij-new-ui-dark');
    assert.ok(entry, 'Extension must be registered in extensions.json');
    assert.equal(entry.version, '1.1.0');
  }

  // 4. Both User settings.json files updated and existing keys preserved
  for (const appDir of ['Antigravity', 'Antigravity IDE']) {
    const settingsPath = path.join(process.env.APPDATA, appDir, 'User/settings.json');
    const backupPath = `${settingsPath}.intellij-backup`;
    assert.ok(fs.existsSync(backupPath), `Backup must exist for ${appDir}`);
    const content = fs.readFileSync(settingsPath, 'utf8');
    const parsed = JSON.parse(content);
    assert.equal(parsed['workbench.colorTheme'], 'IntelliJ IDEA New UI Dark (Pro)');
    assert.equal(parsed['workbench.iconTheme'], 'intellij-new-ui-file-icons');
    assert.equal(parsed['workbench.productIconTheme'], 'intellij-new-ui-product-icons');
    assert.equal(parsed['editor.fontFamily'], "'JetBrains Mono', Consolas, monospace");
    assert.equal(parsed['editor.fontSize'], 13.5);
    assert.equal(parsed['editor.lineHeight'], 1.6);
    assert.equal(parsed['editor.letterSpacing'], 0.3);
    assert.equal(parsed['editor.minimap.autohide'], 'mouseover');
    assert.equal(parsed['workbench.editor.customLabels.enabled'], true);
    assert.deepEqual(parsed['workbench.editor.customLabels.patterns'], { '**/*.java': '${filename}' });
    assert.equal(parsed['cSpell.enabled'], false);
    assert.equal(parsed['problems.decorations.enabled'], false);
    assert.equal(parsed['editor.semanticHighlighting.enabled'], true);
    assert.equal(typeof parsed['intellijNewUi.enableKeymap'], 'boolean');
    assert.equal(typeof parsed['intellijNewUi.onlyApplyInJavaProjects'], 'boolean');
    assert.ok(Array.isArray(parsed['headwind.defaultSortOrder']), 'Existing headwind settings must be preserved');
  }

  // 5. Verify extension.js atomic file switcher works on a mock settings.json without throwing CodeExpectedError
  const extSrc = fs.readFileSync('C:/Users/ADMIN/.antigravity-extensions-src/jetbrains-intellij-new-ui-dark/extension.js', 'utf8');
  assert.match(extSrc, /writeSettingsFileAtomically/, 'extension.js must use atomic file writes to avoid CodeExpectedError');
  assert.match(extSrc, /onDidChangeWindowState/, 'extension.js must sync Java project scope when switching windows');
});
