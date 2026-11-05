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
  'diffEditor.renderIndicators': true,
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

const INTELLIJ_THEMES = new Set([
  'IntelliJ IDEA New UI Dark (Pro)',
  'IntelliJ IDEA New UI Light (Pro)'
]);

function resolvePreferredIntelliJTheme(currentTheme) {
  return INTELLIJ_THEMES.has(currentTheme) ? currentTheme : RECOMMENDED_SETTINGS['workbench.colorTheme'];
}

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

const COMMENT_RE = /\/\*[\s\S]*?\*\/|\/\/.*|"(?:\\.|[^"\\])*"/g;
const TOP_LEVEL_TYPE_RE = /(?:(^|\s)@interface\s+[A-Za-z_$]\w*|\b(abstract\s+class|interface|enum|class)\s+[A-Za-z_$]\w*|\b(record)\s+[A-Z]\w*\s*(?:<[^>]*>)?\s*\()/;
const EXCEPTION_CLASS_RE = /\b(?:abstract\s+)?class\s+\w+[^{;]*?\bextends\s+\w*(?:Exception|Error|Throwable)\b/;
const FINAL_CLASS_RE = /\bfinal\s+class\s+[A-Za-z_$]\w*/;
const MAIN_METHOD_RE = /@SpringBootApplication\b|\b(?:public\s+)?static\s+void\s+main\s*\(\s*(?:final\s+)?String\b/;
const HEADER_BUF = Buffer.allocUnsafe(8192);
const MODULE_MARKER_FILES = new Set(['pom.xml', 'build.gradle', 'build.gradle.kts']);
const PROTECTED_FOLDER_NAMES = new Set([
  'src', 'main', 'java', 'kotlin', 'groovy', 'scala',
  'test', 'tests', '__tests__', 'resources', 'assets', 'public', 'static', 'i18n', 'meta-inf',
  'target', 'build', 'out', 'dist', '.next', 'node_modules', '.gradle',
  '.idea', '.vscode', '.mvn', '.agents', '.github', 'lib', 'libs', 'logs', 'log',
  'common', 'docs'
]);

function classifyJavaByFileNameFast(lower) {
  if (lower.endsWith('test.java') || lower.endsWith('tests.java') || lower.endsWith('it.java')) {
    return '_java_test';
  }
  return null;
}

function classifyJavaContent(src, fileName) {
  const lower = fileName.toLowerCase();
  const fast = classifyJavaByFileNameFast(lower);
  if (fast) return fast;

  const isExceptionName = lower.endsWith('exception.java') || lower.endsWith('error.java');
  const cleaned = src ? src.replace(COMMENT_RE, '') : '';
  if (cleaned) {
    const m = TOP_LEVEL_TYPE_RE.exec(cleaned);
    if (m) {
      if (m[1] !== undefined) return '_java_annotation';
      if (m[3] === 'record') return '_java_record';
      const kind = m[2].replace(/\s+/g, ' ');
      if (kind === 'interface') return '_java_interface';
      if (kind === 'enum') return '_java_enum';
      if (kind === 'abstract class') {
        if (isExceptionName || EXCEPTION_CLASS_RE.test(cleaned)) return '_java_abstract_exception';
        return '_java_abstract';
      }
      if (isExceptionName || EXCEPTION_CLASS_RE.test(cleaned)) return '_java_exception';
      if (MAIN_METHOD_RE.test(cleaned) || lower.endsWith('application.java')) return '_java_runnable';
      if (FINAL_CLASS_RE.test(cleaned)) return '_java_final_class';
      return '_java_class';
    }
  }
  if (isExceptionName) {
    return (lower.startsWith('abstract') || lower.startsWith('base')) ? '_java_abstract_exception' : '_java_exception';
  }
  if (lower.endsWith('application.java')) {
    return '_java_runnable';
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

// Fast 8KB header reader reusing a single shared buffer
function readJavaHeader(filePath) {
  let fd;
  try {
    fd = fs.openSync(filePath, 'r');
    const bytesRead = fs.readSync(fd, HEADER_BUF, 0, 8192, 0);
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
const baseNameOwnerPath = new Map();

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
  const lightFiles = theme.light && theme.light.fileNames ? theme.light.fileNames : null;
  const lightIconId = iconId.replace(/^_/, '_light_');
  const currentEffective = theme.fileNames[baseName] || '_java_class';
  if (currentEffective === iconId) {
    if (iconId === '_java_class' && baseName in theme.fileNames && baseName !== 'createattachmentserviceimpl.java') {
      delete theme.fileNames[baseName];
      if (lightFiles) delete lightFiles[baseName];
      return true;
    }
    if (lightFiles && iconId !== '_java_class' && lightFiles[baseName] !== lightIconId) {
      lightFiles[baseName] = lightIconId;
      return true;
    }
    return false;
  }
  if (iconId === '_java_class' && baseName !== 'createattachmentserviceimpl.java') {
    delete theme.fileNames[baseName];
    if (lightFiles) delete lightFiles[baseName];
    return true;
  }
  theme.fileNames[baseName] = iconId;
  if (lightFiles) {
    lightFiles[baseName] = lightIconId;
  }
  return true;
}

function applyModuleFolderMapping(theme, folderName) {
  const lower = folderName.toLowerCase();
  if (PROTECTED_FOLDER_NAMES.has(lower)) return false;
  if (!theme.folderNames) theme.folderNames = {};
  if (!theme.folderNamesExpanded) theme.folderNamesExpanded = {};
  let changed = false;
  if (theme.folderNames[lower] !== '_folder_config') {
    theme.folderNames[lower] = '_folder_config';
    changed = true;
  }
  if (theme.folderNamesExpanded[lower] !== '_folder_config_open') {
    theme.folderNamesExpanded[lower] = '_folder_config_open';
    changed = true;
  }
  if (theme.light) {
    if (!theme.light.folderNames) theme.light.folderNames = {};
    if (!theme.light.folderNamesExpanded) theme.light.folderNamesExpanded = {};
    if (theme.light.folderNames[lower] !== '_light_folder_config') {
      theme.light.folderNames[lower] = '_light_folder_config';
      changed = true;
    }
    if (theme.light.folderNamesExpanded[lower] !== '_light_folder_config_open') {
      theme.light.folderNamesExpanded[lower] = '_light_folder_config_open';
      changed = true;
    }
  }
  return changed;
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

    const walk = async (dir, isRoot = false) => {
      let entries;
      try {
        entries = await fs.promises.readdir(dir, { withFileTypes: true });
      } catch {
        return;
      }
      if (!isRoot) {
        const isModule = entries.some(
          (e) => e.isFile() && (MODULE_MARKER_FILES.has(e.name.toLowerCase()) || e.name.toLowerCase().endsWith('.iml'))
        );
        if (isModule && applyModuleFolderMapping(theme, path.basename(dir))) {
          changed = true;
        }
      }
      for (const entry of entries) {
        if (entry.isDirectory()) {
          if (!SKIP_SCAN_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
            await walk(path.join(dir, entry.name), false);
          }
        } else if (entry.isFile() && entry.name.endsWith('.java')) {
          const baseName = entry.name.toLowerCase();
          const fullPath = path.join(dir, entry.name);
          scannedFilePaths.add(fullPath);
          const existingIcon = seenBaseNames.get(baseName);
          if (existingIcon && existingIcon !== '_java_class') continue;
          const fastIcon = classifyJavaByFileNameFast(baseName);
          const iconId = fastIcon || classifyJavaContent(readJavaHeader(fullPath), baseName);
          if (existingIcon === '_java_class' && iconId === '_java_class') continue;
          seenBaseNames.set(baseName, iconId);
          baseNameOwnerPath.set(baseName, fullPath);
          if (applyJavaIconMapping(theme, baseName, iconId)) {
            changed = true;
          }
        }
      }
    };

    for (const folder of folders) {
      await walk(folder.uri.fsPath, true);
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
    if (baseNameOwnerPath.has(baseName) && baseNameOwnerPath.get(baseName) !== fsPath) {
      return;
    }

    const theme = getIconThemeCache(context);
    if (!theme) return;

    const fastIcon = classifyJavaByFileNameFast(baseName);
    let iconId = fastIcon;
    if (!iconId) {
      let src = '';
      if (isDoc) {
        src = vscode.Range ? docOrUri.getText(new vscode.Range(0, 0, 200, 0)) : docOrUri.getText().slice(0, 8192);
      } else if (fs.existsSync(fsPath)) {
        src = readJavaHeader(fsPath);
      } else {
        return;
      }
      iconId = classifyJavaContent(src, baseName);
    }

    scannedFilePaths.add(fsPath);
    seenBaseNames.set(baseName, iconId);
    if (!baseNameOwnerPath.has(baseName)) {
      baseNameOwnerPath.set(baseName, fsPath);
    }
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
        const targetVal = key === 'workbench.colorTheme' ? resolvePreferredIntelliJTheme(data[key]) : val;
        if (!settingsValueEquals(data[key], targetVal)) {
          data[key] = targetVal;
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
          const targetVal = key === 'workbench.colorTheme' ? resolvePreferredIntelliJTheme(data[key]) : val;
          if (!settingsValueEquals(data[key], targetVal)) {
            data[key] = targetVal;
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
    vscode.window.showInformationMessage('Đã áp dụng bộ giao diện, icon và font chuẩn IntelliJ IDEA New UI (Pro).');
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
    if (iconThemeCache && iconJsonFilePath) {
      try {
        fs.writeFileSync(iconJsonFilePath, JSON.stringify(iconThemeCache, null, 2), 'utf8');
      } catch {
        // Ignore write error on shutdown
      }
    }
  }
}

module.exports = { activate, deactivate, classifyJavaContent, resolvePreferredIntelliJTheme, applyJavaIconMapping, applyModuleFolderMapping };
