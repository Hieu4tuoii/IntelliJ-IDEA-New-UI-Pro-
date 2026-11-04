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
  'editor.lineHeight': 1.35,
  'editor.fontLigatures': false,
  'editor.semanticHighlighting.enabled': true,
  'editor.renderLineHighlight': 'all',
  'editor.guides.bracketPairs': 'active',
  'editor.inlayHints.padding': true,
  'workbench.tree.indent': 16,
  'workbench.tree.renderIndentGuides': 'onHover'
};

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

async function applySettings(context) {
  const config = vscode.workspace.getConfiguration();
  const previous = {};
  for (const key of Object.keys(RECOMMENDED_SETTINGS)) {
    previous[key] = config.get(key);
  }
  await context.globalState.update('intellijNewUi.previousSettings', previous);
  for (const [key, value] of Object.entries(RECOMMENDED_SETTINGS)) {
    await config.update(key, value, vscode.ConfigurationTarget.Global);
  }
  vscode.window.showInformationMessage('Đã áp dụng bộ giao diện, icon và font chuẩn IntelliJ IDEA New UI Dark (Pro).');
}

async function restoreSettings(context) {
  const previous = context.globalState.get('intellijNewUi.previousSettings');
  const config = vscode.workspace.getConfiguration();
  if (previous && typeof previous === 'object') {
    for (const [key, value] of Object.entries(previous)) {
      await config.update(key, value, vscode.ConfigurationTarget.Global);
    }
  } else {
    await config.update('workbench.colorTheme', 'Default Dark+', vscode.ConfigurationTarget.Global);
    await config.update('workbench.iconTheme', 'material-icon-theme', vscode.ConfigurationTarget.Global);
    await config.update('workbench.productIconTheme', undefined, vscode.ConfigurationTarget.Global);
  }
  vscode.window.showInformationMessage('Đã khôi phục cấu hình giao diện trước đó.');
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('intellijNewUi.applySettings', () => applySettings(context)),
    vscode.commands.registerCommand('intellijNewUi.restoreSettings', () => restoreSettings(context)),
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

