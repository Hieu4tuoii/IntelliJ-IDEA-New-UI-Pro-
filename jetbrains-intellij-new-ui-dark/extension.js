const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const RECOMMENDED_SETTINGS = {
  'workbench.colorTheme': 'IntelliJ IDEA New UI Dark (Pro)',
  'workbench.iconTheme': 'intellij-new-ui-file-icons',
  'editor.fontFamily': "'JetBrains Mono', Consolas, monospace",
  'terminal.integrated.fontFamily': "'JetBrains Mono', Consolas, monospace",
  'editor.fontSize': 12.5,
  'editor.lineHeight': 1.55,
  'editor.letterSpacing': 0.29,
  'terminal.integrated.fontSize': 12.5,
  'terminal.integrated.lineHeight': 1.3,
  'terminal.integrated.letterSpacing': 0.19,
  'editor.fontLigatures': false,
  'editor.semanticHighlighting.enabled': true,
  'editor.renderLineHighlight': 'all',
  'editor.bracketPairColorization.enabled': false,
  'editor.guides.bracketPairs': false,
  'editor.inlayHints.enabled': 'on',
  'editor.inlayHints.fontSize': 11.5,
  'editor.inlayHints.fontFamily': "'JetBrains Mono', Consolas, monospace",
  'editor.inlayHints.padding': true,
  'java.inlayHints.parameterNames.enabled': 'literals',
  'editor.codeLensFontSize': 11.5,
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

const COMMENT_RE = /\/\*[\s\S]*?\*\/|\/\/.*/g;
const ANNOTATION_RE = /(?:^|\s)@interface\s+\w+/;
const INTERFACE_RE = /\binterface\s+\w+/;
const ENUM_RE = /\benum\s+\w+/;
const RECORD_RE = /\brecord\s+\w+/;
const ABSTRACT_CLASS_RE = /\babstract\s+class\s+\w+/;
const EXCEPTION_CLASS_RE = /\bclass\s+\w+[^{;]*?\bextends\s+\w*(?:Exception|Error|Throwable)\b/;
const CLASS_RE = /\bclass\s+\w+/;
const HEADER_BUF = Buffer.allocUnsafe(4096);

function classifyJavaByFileNameFast(lower) {
  if (lower.endsWith('test.java') || lower.endsWith('tests.java') || lower.endsWith('it.java')) {
    return '_java_test';
  }
  if (lower.endsWith('exception.java') || lower.endsWith('error.java')) {
    return '_java_exception';
  }
  return null;
}

function classifyJavaContent(src, fileName) {
  const lower = fileName.toLowerCase();
  const fast = classifyJavaByFileNameFast(lower);
  if (fast) return fast;

  const cleaned = src ? src.replace(COMMENT_RE, '') : '';
  if (cleaned) {
    if (ANNOTATION_RE.test(cleaned)) return '_java_annotation';
    if (INTERFACE_RE.test(cleaned)) return '_java_interface';
    if (ENUM_RE.test(cleaned)) return '_java_enum';
    if (RECORD_RE.test(cleaned)) return '_java_record';
    if (ABSTRACT_CLASS_RE.test(cleaned)) return '_java_abstract';
    if (EXCEPTION_CLASS_RE.test(cleaned)) return '_java_exception';
    if (CLASS_RE.test(cleaned)) return '_java_class';
  }
  if (lower.endsWith('record.java')) {
    return '_java_record';
  }
  if (lower.endsWith('dto.java') || lower.endsWith('request.java') || lower.endsWith('response.java')) {
    return '_java_class';
  }
  if (lower.startsWith('abstract') || lower.startsWith('base')) {
    return '_java_abstract';
  }
  return '_java_class';
}

// Fast 4KB header reader reusing a single shared buffer
function readJavaHeader(filePath) {
  let fd;
  try {
    fd = fs.openSync(filePath, 'r');
    const bytesRead = fs.readSync(fd, HEADER_BUF, 0, 4096, 0);
    return HEADER_BUF.toString('utf8', 0, bytesRead);
  } catch {
    return '';
  } finally {
    if (fd !== undefined) {
      try {
        fs.closeSync(fd);
      } catch {
        // Ignore close error
      }
    }
  }
}

const SKIP_SCAN_DIRS = new Set([
  'node_modules',
  '.git',
  'target',
  'build',
  'dist',
  'out',
  '.next',
  '.idea',
  '.vscode',
  '.mvn',
  '.gradle'
]);

let iconThemeCache = null;
let iconJsonFilePath = null;
let flushTimer = null;
const scannedFilePaths = new Set();
const seenBaseNames = new Map();

function getIconThemeCache(context) {
  if (!iconJsonFilePath) {
    iconJsonFilePath = path.join(context.extensionPath, 'icons', 'file-icons', 'intellij-new-ui-file-icons.json');
  }
  if (!iconThemeCache) {
    if (!fs.existsSync(iconJsonFilePath)) return null;
    iconThemeCache = JSON.parse(fs.readFileSync(iconJsonFilePath, 'utf8'));
    if (!iconThemeCache.fileNames) iconThemeCache.fileNames = {};
  }
  return iconThemeCache;
}

function applyJavaIconMapping(theme, baseName, iconId) {
  const currentEffective = theme.fileNames[baseName] || '_java_class';
  if (currentEffective === iconId) {
    if (iconId === '_java_class' && baseName in theme.fileNames && baseName !== 'createattachmentserviceimpl.java') {
      delete theme.fileNames[baseName];
      return true;
    }
    return false;
  }
  if (iconId === '_java_class' && baseName !== 'createattachmentserviceimpl.java') {
    delete theme.fileNames[baseName];
    return true;
  }
  theme.fileNames[baseName] = iconId;
  return true;
}

function scheduleIconThemeFlush() {
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(async () => {
    flushTimer = null;
    if (!iconThemeCache || !iconJsonFilePath) return;
    try {
      await fs.promises.writeFile(iconJsonFilePath, JSON.stringify(iconThemeCache, null, 2), 'utf8');
    } catch {
      // Ignore write error
    }
  }, 250);
}

async function scanWorkspaceJavaIcons(context) {
  try {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0 || !detectJavaWorkspace()) return;
    const theme = getIconThemeCache(context);
    if (!theme) return;
    let changed = false;

    const walk = async (dir) => {
      let entries;
      try {
        entries = await fs.promises.readdir(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const entry of entries) {
        if (entry.isDirectory()) {
          if (!SKIP_SCAN_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
            await walk(path.join(dir, entry.name));
          }
        } else if (entry.isFile() && entry.name.endsWith('.java')) {
          const baseName = entry.name.toLowerCase();
          const fullPath = path.join(dir, entry.name);
          scannedFilePaths.add(fullPath);
          if (seenBaseNames.has(baseName)) continue;
          const fastIcon = classifyJavaByFileNameFast(baseName);
          const iconId = fastIcon || classifyJavaContent(readJavaHeader(fullPath), baseName);
          seenBaseNames.set(baseName, iconId);
          if (applyJavaIconMapping(theme, baseName, iconId)) {
            changed = true;
          }
        }
      }
    };

    for (const folder of folders) {
      await walk(folder.uri.fsPath);
    }

    if (changed) {
      scheduleIconThemeFlush();
    }
  } catch {
    // Ignore workspace scan errors
  }
}

function updateJavaFileIconMapping(context, docOrUri, isSave = false) {
  try {
    const isDoc = docOrUri && typeof docOrUri.getText === 'function';
    const uri = isDoc ? docOrUri.uri : docOrUri;
    if (!uri || !uri.fsPath || !uri.fsPath.endsWith('.java')) return;
    const fsPath = uri.fsPath;
    const baseName = path.basename(fsPath).toLowerCase();

    if (!isSave && (scannedFilePaths.has(fsPath) || seenBaseNames.has(baseName))) {
      return;
    }

    const theme = getIconThemeCache(context);
    if (!theme) return;

    const fastIcon = classifyJavaByFileNameFast(baseName);
    let iconId = fastIcon;
    if (!iconId) {
      let src = '';
      if (isDoc) {
        src = vscode.Range ? docOrUri.getText(new vscode.Range(0, 0, 100, 0)) : docOrUri.getText().slice(0, 4096);
      } else if (fs.existsSync(fsPath)) {
        src = readJavaHeader(fsPath);
      } else {
        return;
      }
      iconId = classifyJavaContent(src, baseName);
    }

    scannedFilePaths.add(fsPath);
    seenBaseNames.set(baseName, iconId);
    if (applyJavaIconMapping(theme, baseName, iconId)) {
      scheduleIconThemeFlush();
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

function ensureGitExclude(rootPath) {
  const gitDirs = [path.join(rootPath, '.git')];
  try {
    const entries = fs.readdirSync(rootPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        gitDirs.push(path.join(rootPath, entry.name, '.git'));
      }
    }
  } catch {
    // Ignore read errors
  }

  for (const gitDir of gitDirs) {
    try {
      if (!fs.existsSync(gitDir) || !fs.statSync(gitDir).isDirectory()) continue;
      const infoDir = path.join(gitDir, 'info');
      fs.mkdirSync(infoDir, { recursive: true });
      const excludePath = path.join(infoDir, 'exclude');
      const existing = fs.existsSync(excludePath) ? fs.readFileSync(excludePath, 'utf8') : '';
      const lines = existing.split(/\r?\n/).map((l) => l.trim());
      const additions = [];
      if (!lines.includes('.vscode/') && !lines.includes('.vscode')) {
        additions.push('.vscode/');
      }
      if (!lines.includes('.vscode/settings.json')) {
        additions.push('.vscode/settings.json');
      }
      if (additions.length > 0) {
        const prefix = existing.length > 0 && !existing.endsWith('\n') ? '\n' : '';
        fs.writeFileSync(excludePath, `${existing}${prefix}${additions.join('\n')}\n`, 'utf8');
      }
    } catch {
      // Ignore git exclude write errors
    }
  }
}

function settingsValueEquals(a, b) {
  if (a === b) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const k of keysA) {
    if (a[k] !== b[k]) return false;
  }
  return true;
}

async function writeWorkspaceSettingsAtomically(mode) {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) return;

  for (const doc of vscode.workspace.textDocuments) {
    if (doc.isDirty && doc.uri.fsPath && doc.uri.fsPath.endsWith('settings.json')) {
      try {
        await doc.save();
      } catch {
        // Ignore
      }
    }
  }

  const rootPath = folders[0].uri.fsPath;
  const vscodeDir = path.join(rootPath, '.vscode');
  const wsSettingsPath = path.join(vscodeDir, 'settings.json');

  try {
    if (mode === 'intellij') {
      ensureGitExclude(rootPath);
      fs.mkdirSync(vscodeDir, { recursive: true });
      let data = {};
      if (fs.existsSync(wsSettingsPath)) {
        try {
          const raw = fs.readFileSync(wsSettingsPath, 'utf8');
          data = JSON.parse(raw.replace(/,(\s*[}\]])/g, '$1'));
        } catch {
          data = {};
        }
      }
      let changed = false;
      if ('workbench.productIconTheme' in data) {
        delete data['workbench.productIconTheme'];
        changed = true;
      }
      for (const [key, val] of Object.entries(RECOMMENDED_SETTINGS)) {
        if (!settingsValueEquals(data[key], val)) {
          data[key] = val;
          changed = true;
        }
      }
      const filesExclude =
        data['files.exclude'] && typeof data['files.exclude'] === 'object' ? { ...data['files.exclude'] } : {};
      if (filesExclude['**/.vscode'] !== true || filesExclude['**/.vscode/settings.json'] !== true) {
        filesExclude['**/.vscode'] = true;
        filesExclude['**/.vscode/settings.json'] = true;
        data['files.exclude'] = filesExclude;
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(wsSettingsPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      }
    } else if (mode === 'clean') {
      if (!fs.existsSync(wsSettingsPath)) return;
      const raw = fs.readFileSync(wsSettingsPath, 'utf8');
      const data = JSON.parse(raw.replace(/,(\s*[}\]])/g, '$1'));
      let changed = false;

      if ('workbench.productIconTheme' in data) {
        delete data['workbench.productIconTheme'];
        changed = true;
      }
      for (const key of Object.keys(RECOMMENDED_SETTINGS)) {
        if (key in data) {
          delete data[key];
          changed = true;
        }
      }
      if (data['files.exclude'] && typeof data['files.exclude'] === 'object') {
        if ('**/.vscode' in data['files.exclude']) {
          delete data['files.exclude']['**/.vscode'];
          changed = true;
        }
        if ('**/.vscode/settings.json' in data['files.exclude']) {
          delete data['files.exclude']['**/.vscode/settings.json'];
          changed = true;
        }
        if (Object.keys(data['files.exclude']).length === 0) {
          delete data['files.exclude'];
          changed = true;
        }
      }

      if (Object.keys(data).length === 0) {
        fs.rmSync(wsSettingsPath, { force: true });
        try {
          if (fs.readdirSync(vscodeDir).length === 0) {
            fs.rmdirSync(vscodeDir);
          }
        } catch {
          // Ignore
        }
      } else if (changed) {
        fs.writeFileSync(wsSettingsPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      }
    }
  } catch {
    // Ignore workspace settings errors
  }
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
        if ('workbench.productIconTheme' in data) {
          delete data['workbench.productIconTheme'];
          changed = true;
        }
        for (const [key, val] of Object.entries(RECOMMENDED_SETTINGS)) {
          if (!settingsValueEquals(data[key], val)) {
            data[key] = val;
            changed = true;
          }
        }
      } else if (mode === 'default') {
        if ('workbench.productIconTheme' in data) {
          delete data['workbench.productIconTheme'];
          changed = true;
        }
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
  const config = vscode.workspace.getConfiguration();
  const onlyJava = config.get('intellijNewUi.onlyApplyInJavaProjects', false);
  const isJavaProject = detectJavaWorkspace();
  if (onlyJava && isJavaProject) {
    await writeWorkspaceSettingsAtomically('intellij');
    await writeSettingsFileAtomically('default');
  } else {
    await writeWorkspaceSettingsAtomically('clean');
    await writeSettingsFileAtomically('intellij');
  }
  if (!silent) {
    vscode.window.showInformationMessage('Đã áp dụng bộ giao diện, icon và font chuẩn IntelliJ IDEA New UI Dark (Pro).');
  }
}

async function restoreSettings(context, silent = false) {
  await writeWorkspaceSettingsAtomically('clean');
  await writeSettingsFileAtomically('default');
  if (!silent) {
    vscode.window.showInformationMessage('Đã khôi phục cấu hình giao diện mặc định.');
  }
}

async function syncJavaProjectScope(context) {
  const isJavaProject = detectJavaWorkspace();
  const config = vscode.workspace.getConfiguration();
  const onlyJava = config.get('intellijNewUi.onlyApplyInJavaProjects', false);

  // Keymap context per window: immediately disable keymap in non-Java windows when onlyApplyInJavaProjects is true
  const disabledInThisWindow = Boolean(onlyJava && !isJavaProject);
  vscode.commands.executeCommand('setContext', 'intellijNewUi.disabledInThisWindow', disabledInThisWindow);
  vscode.commands.executeCommand('setContext', 'intellijNewUi.isJavaProject', isJavaProject);

  if (onlyJava) {
    // Isolate Java settings in workspace .vscode/settings.json (hidden via files.exclude & .git/info/exclude)
    // and keep global User/settings.json on default so Java and JS windows can run side-by-side without conflict
    if (isJavaProject) {
      await writeWorkspaceSettingsAtomically('intellij');
    } else {
      await writeWorkspaceSettingsAtomically('clean');
    }
    await writeSettingsFileAtomically('default');
  } else {
    await writeWorkspaceSettingsAtomically('clean');
    await writeSettingsFileAtomically('intellij');
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
  syncJavaProjectScope(context);
  setImmediate(() => scanWorkspaceJavaIcons(context));

  context.subscriptions.push(
    vscode.commands.registerCommand('intellijNewUi.applySettings', () => applySettings(context, false)),
    vscode.commands.registerCommand('intellijNewUi.restoreSettings', () => restoreSettings(context, false)),
    vscode.commands.registerCommand('intellijNewUi.toggleKeymap', () => toggleKeymap()),
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      syncJavaProjectScope(context);
      setImmediate(() => scanWorkspaceJavaIcons(context));
    }),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('intellijNewUi.onlyApplyInJavaProjects')) {
        syncJavaProjectScope(context);
      }
    }),
    vscode.workspace.onDidOpenTextDocument((doc) => updateJavaFileIconMapping(context, doc, false)),
    vscode.workspace.onDidSaveTextDocument((doc) => updateJavaFileIconMapping(context, doc, true)),
    vscode.workspace.onDidCreateFiles((event) => {
      for (const uri of event.files) {
        updateJavaFileIconMapping(context, uri, false);
      }
    })
  );
}

function deactivate() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
}

module.exports = { activate, deactivate, classifyJavaContent };
