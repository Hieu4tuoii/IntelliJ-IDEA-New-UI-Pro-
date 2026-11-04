const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const RECOMMENDED_SETTINGS = {
  'workbench.colorTheme': 'IntelliJ IDEA New UI Dark (Pro)',
  'workbench.iconTheme': 'intellij-new-ui-file-icons',
  'workbench.productIconTheme': 'intellij-new-ui-product-icons',
  'editor.fontFamily': "'JetBrains Mono', Consolas, monospace",
  'terminal.integrated.fontFamily': "'JetBrains Mono', Consolas, monospace",
  'editor.fontSize': 13.5,
  'editor.lineHeight': 1.6,
  'editor.letterSpacing': 0.3,
  'terminal.integrated.lineHeight': 1.3,
  'terminal.integrated.letterSpacing': 0.2,
  'editor.fontLigatures': false,
  'editor.semanticHighlighting.enabled': true,
  'editor.renderLineHighlight': 'all',
  'editor.guides.bracketPairs': 'active',
  'editor.inlayHints.padding': true,
  'editor.minimap.autohide': 'mouseover',
  'workbench.editor.customLabels.enabled': true,
  'workbench.editor.customLabels.patterns': {
    '**/*.java': '${filename}'
  },
  'cSpell.enabled': false,
  'problems.decorations.enabled': false,
  'workbench.tree.indent': 16,
  'workbench.tree.renderIndentGuides': 'onHover'
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

async function applySettings(context, silent = false) {
  const config = vscode.workspace.getConfiguration();
  const previous = {};
  for (const key of Object.keys(RECOMMENDED_SETTINGS)) {
    previous[key] = config.get(key);
  }
  await context.globalState.update('intellijNewUi.previousSettings', previous);
  for (const [key, value] of Object.entries(RECOMMENDED_SETTINGS)) {
    await config.update(key, value, vscode.ConfigurationTarget.Global);
  }
  if (!silent) {
    vscode.window.showInformationMessage('Đã áp dụng bộ giao diện, icon và font chuẩn IntelliJ IDEA New UI Dark (Pro).');
  }
}

async function restoreSettings(context, silent = false) {
  const previous = context.globalState.get('intellijNewUi.previousSettings');
  const config = vscode.workspace.getConfiguration();
  if (previous && typeof previous === 'object') {
    for (const [key, value] of Object.entries(previous)) {
      await config.update(key, value, vscode.ConfigurationTarget.Global);
    }
  } else {
    await config.update('workbench.colorTheme', 'Default Dark+', vscode.ConfigurationTarget.Global);
    await config.update('workbench.iconTheme', 'material-icon-theme', vscode.ConfigurationTarget.Global);
    await config.update('workbench.productIconTheme', 'Default', vscode.ConfigurationTarget.Global);
  }
  if (!silent) {
    vscode.window.showInformationMessage('Đã khôi phục cấu hình giao diện trước đó.');
  }
}

async function syncJavaProjectScope(context, isJavaProject) {
  const config = vscode.workspace.getConfiguration();
  const onlyJava = config.get('intellijNewUi.onlyApplyInJavaProjects', false);
  if (!onlyJava) return;
  const currentTheme = config.get('workbench.colorTheme');
  if (isJavaProject && currentTheme !== 'IntelliJ IDEA New UI Dark (Pro)') {
    await applySettings(context, true);
  } else if (!isJavaProject && currentTheme === 'IntelliJ IDEA New UI Dark (Pro)') {
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
  const isJavaProject = detectJavaWorkspace();
  vscode.commands.executeCommand('setContext', 'intellijNewUi.isJavaProject', isJavaProject);
  syncJavaProjectScope(context, isJavaProject);

  context.subscriptions.push(
    vscode.commands.registerCommand('intellijNewUi.applySettings', () => applySettings(context, false)),
    vscode.commands.registerCommand('intellijNewUi.restoreSettings', () => restoreSettings(context, false)),
    vscode.commands.registerCommand('intellijNewUi.toggleKeymap', () => toggleKeymap()),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('intellijNewUi.onlyApplyInJavaProjects')) {
        const javaNow = detectJavaWorkspace();
        vscode.commands.executeCommand('setContext', 'intellijNewUi.isJavaProject', javaNow);
        syncJavaProjectScope(context, javaNow);
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
