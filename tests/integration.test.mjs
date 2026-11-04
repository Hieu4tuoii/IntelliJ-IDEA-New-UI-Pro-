import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('JetBrains Mono font, VSIX packages, extension directories, and IDE settings are properly installed', () => {
  // 1. Font installed in Windows User Fonts
  const fontDir = path.join(process.env.LOCALAPPDATA, 'Microsoft/Windows/Fonts');
  assert.ok(fs.existsSync(path.join(fontDir, 'JetBrainsMono-Regular.ttf')), 'JetBrainsMono-Regular.ttf must be installed');
  assert.ok(fs.existsSync(path.join(fontDir, 'JetBrainsMono-Italic.ttf')), 'JetBrainsMono-Italic.ttf must be installed');
  assert.ok(fs.existsSync(path.join(fontDir, 'JetBrainsMono-Bold.ttf')), 'JetBrainsMono-Bold.ttf must be installed');

  // 2. VSIX files generated
  const distDir = 'C:/Users/ADMIN/.antigravity-extensions-src/dist';
  assert.ok(fs.existsSync(path.join(distDir, 'jetbrains-intellij-new-ui-dark-1.0.0.vsix')));
  assert.ok(fs.existsSync(path.join(distDir, 'jetbrains-intellij-keymap-1.0.0.vsix')));

  // 3. Installed in both .antigravity and .antigravity-ide
  for (const extRoot of ['C:/Users/ADMIN/.antigravity/extensions', 'C:/Users/ADMIN/.antigravity-ide/extensions']) {
    assert.ok(fs.existsSync(path.join(extRoot, 'elaand.jetbrains-intellij-new-ui-dark-1.0.0/package.json')));
    assert.ok(fs.existsSync(path.join(extRoot, 'elaand.jetbrains-intellij-keymap-1.0.0/package.json')));
    const reg = JSON.parse(fs.readFileSync(path.join(extRoot, 'extensions.json'), 'utf8'));
    assert.ok(reg.some(e => e.identifier?.id === 'elaand.jetbrains-intellij-new-ui-dark'));
    assert.ok(reg.some(e => e.identifier?.id === 'elaand.jetbrains-intellij-keymap'));
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
    assert.equal(parsed['editor.semanticHighlighting.enabled'], true);
    assert.ok(Array.isArray(parsed['headwind.defaultSortOrder']), 'Existing headwind settings must be preserved');
  }
});
