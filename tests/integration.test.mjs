import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

test('JetBrains Mono font, single unified VSIX package v1.2.0, extension directories, and atomic settings switcher work properly', () => {
  // 1. Font installed in Windows User Fonts
  const fontDir = path.join(process.env.LOCALAPPDATA, 'Microsoft/Windows/Fonts');
  assert.ok(fs.existsSync(path.join(fontDir, 'JetBrainsMono-Regular.ttf')), 'JetBrainsMono-Regular.ttf must be installed');
  assert.ok(fs.existsSync(path.join(fontDir, 'JetBrainsMono-Italic.ttf')), 'JetBrainsMono-Italic.ttf must be installed');
  assert.ok(fs.existsSync(path.join(fontDir, 'JetBrainsMono-Bold.ttf')), 'JetBrainsMono-Bold.ttf must be installed');

  // 2. Single unified VSIX file v1.2.0 generated, old VSIXs removed
  const distDir = path.join(ROOT, 'dist');
  assert.ok(fs.existsSync(path.join(distDir, 'jetbrains-intellij-new-ui-pro-1.2.0.vsix')));
  assert.ok(!fs.existsSync(path.join(distDir, 'jetbrains-intellij-new-ui-dark-1.1.0.vsix')), 'Old dark VSIX must be removed');
  assert.ok(!fs.existsSync(path.join(distDir, 'jetbrains-intellij-keymap-1.0.0.vsix')), 'Separate keymap VSIX must be removed');

  // 3. Installed in both .antigravity and .antigravity-ide as v1.2.0, and old dark / 1.0.0 / keymap folders removed
  for (const extRoot of ['C:/Users/ADMIN/.antigravity/extensions', 'C:/Users/ADMIN/.antigravity-ide/extensions']) {
    assert.ok(fs.existsSync(path.join(extRoot, 'elaand.jetbrains-intellij-new-ui-pro-1.2.0/package.json')));
    assert.ok(fs.existsSync(path.join(extRoot, 'elaand.jetbrains-intellij-new-ui-pro-1.2.0/themes/intellij-new-ui-dark-pro.json')));
    assert.ok(fs.existsSync(path.join(extRoot, 'elaand.jetbrains-intellij-new-ui-pro-1.2.0/themes/intellij-new-ui-light-pro.json')));
    assert.ok(!fs.existsSync(path.join(extRoot, 'elaand.jetbrains-intellij-new-ui-dark-1.1.0')), 'Old dark 1.1.0 folder must be removed');
    assert.ok(!fs.existsSync(path.join(extRoot, 'elaand.jetbrains-intellij-new-ui-dark-1.0.0')), 'Old 1.0.0 folder must be removed');
    assert.ok(!fs.existsSync(path.join(extRoot, 'elaand.jetbrains-intellij-keymap-1.0.0')), 'Old separate keymap folder must be removed');
    const reg = JSON.parse(fs.readFileSync(path.join(extRoot, 'extensions.json'), 'utf8'));
    const entry = reg.find(e => e.identifier?.id === 'elaand.jetbrains-intellij-new-ui-pro');
    assert.ok(entry, 'Extension must be registered in extensions.json');
    assert.equal(entry.version, '1.2.0');
    assert.equal(
      reg.find(e => e.identifier?.id === 'elaand.jetbrains-intellij-new-ui-dark'),
      undefined,
      'Legacy dark extension id must be removed from extensions.json'
    );
  }

  // 4. Both User settings.json files updated and existing keys preserved
  for (const appDir of ['Antigravity', 'Antigravity IDE']) {
    const settingsPath = path.join(process.env.APPDATA, appDir, 'User/settings.json');
    const backupPath = `${settingsPath}.intellij-backup`;
    assert.ok(fs.existsSync(backupPath), `Backup must exist for ${appDir}`);
    const content = fs.readFileSync(settingsPath, 'utf8');
    const parsed = JSON.parse(content);
    if (parsed['workbench.colorTheme'] === 'IntelliJ IDEA New UI Dark (Pro)') {
      assert.equal(parsed['workbench.iconTheme'], 'intellij-new-ui-file-icons');
      assert.equal(parsed['workbench.productIconTheme'], undefined);
      assert.equal(parsed['editor.fontFamily'], "'JetBrains Mono', Consolas, monospace");
      assert.equal(parsed['editor.fontSize'], 12.5);
      assert.equal(parsed['editor.lineHeight'], 1.55);
      assert.equal(parsed['editor.letterSpacing'], 0.29);
      assert.equal(parsed['terminal.integrated.fontSize'], 12.5);
      assert.equal(parsed['terminal.integrated.letterSpacing'], 0.19);
      assert.equal(parsed['window.zoomLevel'], 0.3);
      assert.equal(parsed['editor.inlayHints.fontSize'], 11.5);
      assert.equal(parsed['editor.codeLensFontSize'], 11.5);
      assert.equal(parsed['editor.minimap.autohide'], 'mouseover');
      assert.equal(parsed['workbench.editor.customLabels.enabled'], true);
      assert.deepEqual(parsed['workbench.editor.customLabels.patterns'], { '**/*.java': '${filename}' });
      assert.equal(parsed['cSpell.enabled'], false);
      assert.equal(parsed['problems.decorations.enabled'], false);
      assert.equal(parsed['explorer.decorations.badges'], false);
      assert.equal(parsed['workbench.editor.decorations.badges'], false);
      assert.equal(parsed['editor.stickyScroll.enabled'], true);
      assert.equal(parsed['editor.bracketPairColorization.enabled'], false);
      assert.equal(parsed['editor.semanticHighlighting.enabled'], true);
    }
    assert.equal(typeof parsed['intellijNewUi.enableKeymap'], 'boolean');
    assert.equal(typeof parsed['intellijNewUi.onlyApplyInJavaProjects'], 'boolean');
    assert.equal(parsed['java.compile.nullAnalysis.mode'], 'automatic');
    assert.equal(parsed['java.implementationsCodeLens.enabled'], 'all');
    assert.equal(parsed['java.referencesCodeLens.enabled'], true);
    assert.equal(parsed['editor.gotoLocation.multipleImplementations'], 'goto');
    assert.equal(parsed['editor.gotoLocation.multipleDefinitions'], 'goto');
    assert.equal(parsed['editor.pasteAs.enabled'], true);
    assert.deepEqual(parsed['java.completion.importOrder'], ['java', 'javax', 'jakarta', 'org', 'com', '']);
    assert.ok(Array.isArray(parsed['headwind.defaultSortOrder']), 'Existing headwind settings must be preserved');
  }

  // 5. Verify extension.js workspace-scoped isolation (.vscode/settings.json + .git/info/exclude + files.exclude)
  const extSrc = fs.readFileSync(path.join(ROOT, 'jetbrains-intellij-new-ui-pro/extension.js'), 'utf8');
  assert.match(extSrc, /'editor\.fontSize':\s*12\.5/, 'extension.js must set editor.fontSize to 12.5');
  assert.match(extSrc, /'java\.compile\.nullAnalysis\.mode':\s*'automatic'/, 'extension.js must enable automatic Java null analysis');
  assert.match(extSrc, /'editor\.gotoLocation\.multipleImplementations':\s*'goto'/, 'extension.js must jump directly to single implementation on Ctrl+Alt+B');
  assert.match(extSrc, /writeSettingsFileAtomically/, 'extension.js must use atomic file writes to avoid CodeExpectedError');
  assert.match(extSrc, /writeWorkspaceSettingsAtomically/, 'extension.js must isolate Java project theme in workspace .vscode/settings.json');
  assert.match(extSrc, /ensureGitExclude/, 'extension.js must hide .vscode/settings.json in .git/info/exclude');
  assert.match(extSrc, /files\.exclude/, 'extension.js must hide .vscode in Explorer via files.exclude');
});
