import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = 'C:/Users/ADMIN/.antigravity-extensions-src';
const DIST_DIR = path.join(ROOT, 'dist');
const FONT_DIR = path.join(process.env.LOCALAPPDATA, 'Microsoft/Windows/Fonts');

fs.mkdirSync(DIST_DIR, { recursive: true });
fs.mkdirSync(FONT_DIR, { recursive: true });

// 1. Download & install official JetBrains Mono TTF fonts into Windows User Fonts + Registry + GDI32 live load
const FONTS = [
  { file: 'JetBrainsMono-Regular.ttf', regName: 'JetBrains Mono Regular (TrueType)' },
  { file: 'JetBrainsMono-Italic.ttf', regName: 'JetBrains Mono Italic (TrueType)' },
  { file: 'JetBrainsMono-Medium.ttf', regName: 'JetBrains Mono Medium (TrueType)' },
  { file: 'JetBrainsMono-MediumItalic.ttf', regName: 'JetBrains Mono Medium Italic (TrueType)' },
  { file: 'JetBrainsMono-Bold.ttf', regName: 'JetBrains Mono Bold (TrueType)' },
  { file: 'JetBrainsMono-BoldItalic.ttf', regName: 'JetBrains Mono Bold Italic (TrueType)' }
];

const CDN_BASE = 'https://raw.githubusercontent.com/JetBrains/JetBrainsMono/master/fonts/ttf';

for (const font of FONTS) {
  const targetPath = path.join(FONT_DIR, font.file);
  if (!fs.existsSync(targetPath) || fs.statSync(targetPath).size < 10000) {
    const url = `${CDN_BASE}/${font.file}`;
    console.log(`Downloading ${font.file}...`);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to download ${url}: ${res.status}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(targetPath, buf);
  }
}

// Register fonts in HKCU and broadcast WM_FONTCHANGE via Python ctypes
const pyFontInstall = `
import ctypes, os, winreg

font_dir = r"${FONT_DIR.replace(/\\/g, '\\\\')}"
fonts = ${JSON.stringify(FONTS)}

key_path = r"Software\\Microsoft\\Windows NT\\CurrentVersion\\Fonts"
with winreg.CreateKey(winreg.HKEY_CURRENT_USER, key_path) as key:
    for f in fonts:
        full_path = os.path.join(font_dir, f["file"])
        winreg.SetValueEx(key, f["regName"], 0, winreg.REG_SZ, full_path)
        ctypes.windll.gdi32.AddFontResourceW(full_path)

HWND_BROADCAST = 0xFFFF
WM_FONTCHANGE = 0x001D
SMTO_ABORTIFHUNG = 0x0002
result = ctypes.c_ulong()
ctypes.windll.user32.SendMessageTimeoutW(HWND_BROADCAST, WM_FONTCHANGE, 0, 0, SMTO_ABORTIFHUNG, 1000, ctypes.byref(result))
print("Installed and activated JetBrains Mono fonts in Windows session.")
`;
execSync('python -', { input: pyFontInstall, stdio: ['pipe', 'inherit', 'inherit'] });

// 2. Package both extensions as .vsix archives (OpenVSX / VS Code standard zip layout under extension/)
const pyPackageVsix = `
import os, zipfile, json

root = r"${ROOT.replace(/\\/g, '\\\\')}"
dist = r"${DIST_DIR.replace(/\\/g, '\\\\')}"

def build_vsix(ext_folder_name, vsix_filename):
    src_dir = os.path.join(root, ext_folder_name)
    pkg = json.load(open(os.path.join(src_dir, "package.json"), encoding="utf-8"))
    vsix_path = os.path.join(dist, vsix_filename)
    content_types = '''<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension=".json" ContentType="application/json"/>
  <Default Extension=".js" ContentType="application/javascript"/>
  <Default Extension=".md" ContentType="text/markdown"/>
  <Default Extension=".svg" ContentType="image/svg+xml"/>
  <Default Extension=".woff" ContentType="font/woff"/>
  <Default Extension=".vsixmanifest" ContentType="text/xml"/>
</Types>'''
    manifest = f'''<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011">
  <Metadata>
    <Identity Language="en-US" Id="{pkg['name']}" Version="{pkg['version']}" Publisher="{pkg['publisher']}"/>
    <DisplayName>{pkg['displayName']}</DisplayName>
    <Description xml:space="preserve">{pkg['description']}</Description>
  </Metadata>
  <Installation>
    <InstallationTarget Id="Microsoft.VisualStudio.Code"/>
  </Installation>
  <Dependencies/>
  <Assets>
    <Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true"/>
  </Assets>
</PackageManifest>'''
    with zipfile.ZipFile(vsix_path, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", content_types)
        zf.writestr("extension.vsixmanifest", manifest)
        for dirpath, _, filenames in os.walk(src_dir):
            for fn in filenames:
                full = os.path.join(dirpath, fn)
                rel = os.path.relpath(full, src_dir).replace("\\\\", "/")
                zf.write(full, f"extension/{rel}")
    print(f"Packaged {vsix_path} ({os.path.getsize(vsix_path)} bytes)")

build_vsix("jetbrains-intellij-new-ui-dark", "jetbrains-intellij-new-ui-dark-1.0.0.vsix")
build_vsix("jetbrains-intellij-keymap", "jetbrains-intellij-keymap-1.0.0.vsix")
`;
execSync('python -', { input: pyPackageVsix, stdio: ['pipe', 'inherit', 'inherit'] });

// 3. Install into both .antigravity/extensions and .antigravity-ide/extensions & register in extensions.json
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const EXT_ROOTS = [
  'C:/Users/ADMIN/.antigravity/extensions',
  'C:/Users/ADMIN/.antigravity-ide/extensions'
];

const EXTENSIONS_TO_INSTALL = [
  {
    srcDir: path.join(ROOT, 'jetbrains-intellij-new-ui-dark'),
    targetFolder: 'elaand.jetbrains-intellij-new-ui-dark-1.0.0',
    id: 'elaand.jetbrains-intellij-new-ui-dark',
    version: '1.0.0'
  },
  {
    srcDir: path.join(ROOT, 'jetbrains-intellij-keymap'),
    targetFolder: 'elaand.jetbrains-intellij-keymap-1.0.0',
    id: 'elaand.jetbrains-intellij-keymap',
    version: '1.0.0'
  }
];

for (const extRoot of EXT_ROOTS) {
  if (!fs.existsSync(extRoot)) continue;
  const regPath = path.join(extRoot, 'extensions.json');
  let registry = [];
  if (fs.existsSync(regPath)) {
    try {
      registry = JSON.parse(fs.readFileSync(regPath, 'utf8'));
    } catch {
      registry = [];
    }
  }

  for (const ext of EXTENSIONS_TO_INSTALL) {
    const destDir = path.join(extRoot, ext.targetFolder);
    copyDirSync(ext.srcDir, destDir);

    // Remove existing registration entry if present
    registry = registry.filter(item => item?.identifier?.id !== ext.id);
    const normalizedPath = destDir.replace(/\\/g, '/').replace(/^([A-Za-z]):/, (_, d) => `/${d.toLowerCase()}:`);
    registry.push({
      identifier: { id: ext.id },
      version: ext.version,
      location: {
        $mid: 1,
        path: normalizedPath,
        scheme: 'file'
      },
      relativeLocation: ext.targetFolder,
      metadata: {
        installedTimestamp: Date.now(),
        pinned: true,
        source: 'vsix'
      }
    });
  }

  fs.writeFileSync(regPath, JSON.stringify(registry), 'utf8');
  console.log(`Installed extensions and updated ${regPath}`);
}

// 4. Safely backup and update settings.json for both Antigravity and Antigravity IDE (handling JSONC trailing commas)
function parseJsonc(raw) {
  // Remove trailing commas before } or ] outside strings
  const cleaned = raw.replace(/,(\s*[}\]])/g, '$1');
  return JSON.parse(cleaned);
}

for (const appName of ['Antigravity', 'Antigravity IDE']) {
  const settingsPath = path.join(process.env.APPDATA, appName, 'User/settings.json');
  if (!fs.existsSync(settingsPath)) continue;
  const backupPath = `${settingsPath}.intellij-backup`;
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(settingsPath, backupPath);
  }

  const raw = fs.readFileSync(settingsPath, 'utf8');
  const settings = parseJsonc(raw);

  settings['workbench.colorTheme'] = 'IntelliJ IDEA New UI Dark (Pro)';
  settings['workbench.iconTheme'] = 'intellij-new-ui-file-icons';
  settings['workbench.productIconTheme'] = 'intellij-new-ui-product-icons';
  settings['editor.fontFamily'] = "'JetBrains Mono', Consolas, monospace";
  settings['terminal.integrated.fontFamily'] = "'JetBrains Mono', Consolas, monospace";
  settings['editor.fontSize'] = 13;
  settings['editor.lineHeight'] = 1.35;
  settings['editor.fontLigatures'] = false;
  settings['editor.semanticHighlighting.enabled'] = true;
  settings['editor.renderLineHighlight'] = 'all';
  settings['editor.guides.bracketPairs'] = 'active';
  settings['editor.inlayHints.padding'] = true;
  settings['workbench.tree.indent'] = 16;
  settings['workbench.tree.renderIndentGuides'] = 'onHover';

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf8');
  console.log(`Backed up and updated ${settingsPath}`);
}
