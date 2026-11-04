const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const RECOMMENDED_SETTINGS = {
  'workbench.colorTheme': 'IntelliJ IDEA New UI Dark (Pro)',
  'workbench.iconTheme': 'intellij-new-ui-file-icons',
  'workbench.productIconTheme': 'intellij-new-ui-product-icons',
  'editor.fontFamily': "'JetBrains Mono', Consolas, monospace",
  'terminal.integrated.fontFamily': "'JetBrains Mono', Consolas, monospace",
  'editor.fontSize': 13,
  'editor.lineHeight': 1.55,
  'editor.letterSpacing': 0.3,
  'terminal.integrated.lineHeight': 1.3,
  'terminal.integrated.letterSpacing': 0.2,
  'editor.fontLigatures': false,
  'editor.semanticHighlighting.enabled': true,
  'editor.renderLineHighlight': 'all',
  'editor.bracketPairColorization.enabled': false,
  'editor.guides.bracketPairs': false,
  'editor.inlayHints.enabled': 'on',
  'editor.inlayHints.fontSize': 12,
  'editor.inlayHints.fontFamily': "'JetBrains Mono', Consolas, monospace",
  'editor.inlayHints.padding': true,
  'java.inlayHints.parameterNames.enabled': 'literals',
  'editor.codeLensFontSize': 12,
  'editor.codeLensFontFamily': "'Segoe UI', Inter, sans-serif",
  'editor.stickyScroll.enabled': true,
  'editor.minimap.autohide': 'mouseover',
  'diffEditor.renderIndicators': false,
  'workbench.editor.customLabels.enabled': true,
  'workbench.editor.customLabels.patterns': {
    '**/*.java': '${filename}'
  },
  'workbench.editor.decorations.badges': false,
  'cSpell.enabled': false,
  'problems.decorations.enabled': false,
  'explorer.decorations.badges': false,
  'explorer.decorations.colors': true,
  'workbench.tree.indent': 16,
  'workbench.tree.renderIndentGuides': 'onHover'
};

const DEFAULT_FALLBACK_SETTINGS = {
  'workbench.colorTheme': 'Default Dark+',
  'workbench.iconTheme': 'material-icon-theme'
};

const JAVA_MARKERS = ['pom.xml', 'build.gradle', 'build.gradle.kts', 'mvnw', 'gradlew', '.mvn'];

// Fast synchronous 1-time check (< 1ms) at startup: checks root and 1-level subfolders
function detectJavaWorkspace() {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) return false;
  for (const folder of folders) {
    const rootPath = folder.uri.fsPath;
    for (const marker of JAVA_MARKERS) {
      if (fs.existsSync(path.join(rootPath, marker))) return true;
    }
    try {
      const entries = fs.readdirSync(rootPath, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.java')) return true;
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          for (const marker of JAVA_MARKERS) {
            if (fs.existsSync(path.join(rootPath, entry.name, marker))) return true;
          }
        }
      }
    } catch {
      // Ignore permission errors
    }
  }
  return false;
}

function classifyJavaContent(src, fileName) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('test.java') || lower.endsWith('tests.java') || lower.endsWith('it.java')) {
    return '_java_test';
  }
  if (lower.endsWith('exception.java') || lower.endsWith('error.java')) {
    return '_java_exception';
  }
  const cleaned = src.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
  if (/(?:^|\s)@interface\s+\w+/.test(cleaned)) return '_java_annotation';
  if (/\binterface\s+\w+/.test(cleaned)) return '_java_interface';
  if (/\benum\s+\w+/.test(cleaned)) return '_java_enum';
  if (/\brecord\s+\w+/.test(cleaned)) return '_java_record';
  if (/\babstract\s+class\s+\w+/.test(cleaned)) return '_java_abstract';
  if (lower.endsWith('dto.java') || lower.endsWith('request.java') || lower.endsWith('response.java') || lower.endsWith('record.java')) {
    return '_java_record';
  }
  if (lower.startsWith('abstract') || lower.startsWith('base')) {
    return '_java_abstract';
  }
  return '_java_class';
}

function updateJavaFileIconMapping(context, uri) {
  try {
    if (!uri || !uri.fsPath || !uri.fsPath.endsWith('.java')) return;
    const iconJsonPath = path.join(context.extensionPath, 'icons', 'file-icons', 'intellij-new-ui-file-icons.json');
    if (!fs.existsSync(iconJsonPath) || !fs.existsSync(uri.fsPath)) return;
    const src = fs.readFileSync(uri.fsPath, 'utf8');
    const baseName = path.basename(uri.fsPath).toLowerCase();
    const iconId = classifyJavaContent(src, baseName);
    const theme = JSON.parse(fs.readFileSync(iconJsonPath, 'utf8'));
    if (theme.fileNames && theme.fileNames[baseName] !== iconId) {
      theme.fileNames[baseName] = iconId;
      fs.writeFileSync(iconJsonPath, JSON.stringify(theme, null, 2), 'utf8');
    }
  } catch {
    // Ignore transient file access errors
  }
}

function getSettingsFilePaths() {
  const appData = process.env.APPDATA;
  if (!appData) return [];
  return ['Antigravity IDE', 'Antigravity']
    .map((app) => path.join(appData, app, 'User', 'settings.json'))
    .filter((p) => fs.existsSync(p));
}

// Writes User/settings.json atomically on disk to avoid VS Code CodeExpectedError
// ("Unable to write into user settings because the content of the file is newer / has unsaved changes")
async function writeSettingsFileAtomically(mode) {
  // First save any dirty settings.json open in editor so it doesn't block or overwrite
  for (const doc of vscode.workspace.textDocuments) {
    if (doc.isDirty && doc.uri.fsPath && doc.uri.fsPath.endsWith('settings.json')) {
      try {
        await doc.save();
      } catch {
        // Ignore
      }
    }
  }

  for (const settingsPath of getSettingsFilePaths()) {
    try {
      const raw = fs.readFileSync(settingsPath, 'utf8');
      const cleaned = raw.replace(/,(\s*[}\]])/g, '$1');
      const data = JSON.parse(cleaned);
      let changed = false;

      if (mode === 'intellij') {
        for (const [key, val] of Object.entries(RECOMMENDED_SETTINGS)) {
          if (JSON.stringify(data[key]) !== JSON.stringify(val)) {
            data[key] = val;
            changed = true;
          }
        }
      } else if (mode === 'default') {
        for (const key of Object.keys(RECOMMENDED_SETTINGS)) {
          if (key in DEFAULT_FALLBACK_SETTINGS) {
            if (data[key] !== DEFAULT_FALLBACK_SETTINGS[key]) {
              data[key] = DEFAULT_FALLBACK_SETTINGS[key];
              changed = true;
            }
          } else if (key in data) {
            delete data[key];
            changed = true;
          }
        }
      }

      if (changed) {
        fs.writeFileSync(settingsPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      }
    } catch {
      // Ignore parse/write errors
    }
  }
}

async function applySettings(context, silent = false) {
  await writeSettingsFileAtomically('intellij');
  if (!silent) {
    vscode.window.showInformationMessage('Đã áp dụng bộ giao diện, icon và font chuẩn IntelliJ IDEA New UI Dark (Pro).');
  }
}

async function restoreSettings(context, silent = false) {
  await writeSettingsFileAtomically('default');
  if (!silent) {
    vscode.window.showInformationMessage('Đã khôi phục cấu hình giao diện mặc định.');
  }
}

async function syncJavaProjectScope(context, forceRun = false) {
  const isJavaProject = detectJavaWorkspace();
  const config = vscode.workspace.getConfiguration();
  const onlyJava = config.get('intellijNewUi.onlyApplyInJavaProjects', false);

  // Keymap context per window: immediately disable keymap in non-Java windows when onlyApplyInJavaProjects is true
  const disabledInThisWindow = Boolean(onlyJava && !isJavaProject);
  vscode.commands.executeCommand('setContext', 'intellijNewUi.disabledInThisWindow', disabledInThisWindow);
  vscode.commands.executeCommand('setContext', 'intellijNewUi.isJavaProject', isJavaProject);

  if (!onlyJava) return;
  if (!forceRun && !vscode.window.state.focused) return;

  if (isJavaProject) {
    await applySettings(context, true);
  } else {
    await restoreSettings(context, true);
  }
}

async function toggleKeymap() {
  const config = vscode.workspace.getConfiguration('intellijNewUi');
  const current = config.get('enableKeymap', true);
  await config.update('enableKeymap', !current, vscode.ConfigurationTarget.Global);
  vscode.window.showInformationMessage(
    !current
      ? 'Đã BẬT bộ phím tắt IntelliJ IDEA Keymap.'
      : 'Đã TẮT bộ phím tắt IntelliJ IDEA Keymap (trở về phím tắt mặc định).'
  );
}

function activate(context) {
  syncJavaProjectScope(context, true);

  context.subscriptions.push(
    vscode.commands.registerCommand('intellijNewUi.applySettings', () => applySettings(context, false)),
    vscode.commands.registerCommand('intellijNewUi.restoreSettings', () => restoreSettings(context, false)),
    vscode.commands.registerCommand('intellijNewUi.toggleKeymap', () => toggleKeymap()),
    vscode.window.onDidChangeWindowState((state) => {
      if (state.focused) {
        syncJavaProjectScope(context, true);
      }
    }),
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      syncJavaProjectScope(context, true);
    }),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('intellijNewUi.onlyApplyInJavaProjects')) {
        syncJavaProjectScope(context, true);
      }
    }),
    vscode.workspace.onDidSaveTextDocument((doc) => updateJavaFileIconMapping(context, doc.uri)),
    vscode.workspace.onDidCreateFiles((event) => {
      for (const uri of event.files) {
        updateJavaFileIconMapping(context, uri);
      }
    })
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
