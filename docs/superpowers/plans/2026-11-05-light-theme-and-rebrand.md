# Light Theme, Extension Rebrand & GitHub Push Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `IntelliJ IDEA New UI Light (Pro)` color theme and `expui` Light file icons (switchable directly via the IDE's Color Theme menu without affecting `IntelliJ IDEA New UI Dark (Pro)`), rename the extension to `IntelliJ IDEA New UI (Pro)` (`jetbrains-intellij-new-ui-pro` v1.2.0), and push the repository to `https://github.com/Hieu4tuoii/IntelliJ-IDEA-New-UI-Pro-.git` (`main`).

**Architecture:** Keep the existing `ExperimentalDark` theme JSON (`themes/intellij-new-ui-dark-pro.json`) and dark SVG file icons 100% unchanged; generate a sibling `ExperimentalLight` theme (`themes/intellij-new-ui-light-pro.json`) in `scripts/build-theme.mjs` and a top-level `light` override block (`svgs/light/*.svg`) in `scripts/build-file-icons.mjs`; update `extension.js` and `scripts/install-and-package.mjs` to preserve whichever IntelliJ theme (`Dark (Pro)` or `Light (Pro)`) is active in IDE settings; and rename the package/folder from `jetbrains-intellij-new-ui-dark` to `jetbrains-intellij-new-ui-pro` v1.2.0.

**Tech Stack:** Node.js (CommonJS for VS Code extension runtime, ES Modules for build scripts and `node:test` test suite), Python 3 (for WOFF font and VSIX archive packaging), Git.

**Spec:** `docs/superpowers/specs/2026-11-05-light-theme-and-rebrand-design.md`

## Global Constraints

- Zero changes to any color, semantic token, TextMate scope, or SVG icon when using `IntelliJ IDEA New UI Dark (Pro)`.
- Extension `name` must be `"jetbrains-intellij-new-ui-pro"`, `displayName` must be `"IntelliJ IDEA New UI (Pro)"`, `publisher` must be `"elaand"`, and `version` must be `"1.2.0"`.
- Both `IntelliJ IDEA New UI Dark (Pro)` (`uiTheme: "vs-dark"`) and `IntelliJ IDEA New UI Light (Pro)` (`uiTheme: "vs"`) must be registered in `contributes.themes` and selectable directly via the IDE Color Theme picker.
- Compatible 100% with `npm test` (`node --test tests/*.test.mjs`).

## Review Focus

- Every single assertion for `IntelliJ IDEA New UI Dark (Pro)` in `tests/theme.test.mjs` and `tests/file-icons.test.mjs` must continue to pass with zero modifications to Dark theme values.
- Selecting `IntelliJ IDEA New UI Light (Pro)` via the IDE Color Theme menu must not be overwritten back to `IntelliJ IDEA New UI Dark (Pro)` when `extension.js` runs `syncJavaProjectScope()` or `applySettings()` on startup or workspace folder change.
- Java `import` and `package` statements (`storage.type.import.java`, `storage.type.package.java`) in `IntelliJ IDEA New UI Light (Pro)` must use `#080808` in TextMate `tokenColors` to match `semanticTokenColors` and prevent blue-to-black text flicker when opening `.java` files.
- Dynamic Java icon classification (`applyJavaIconMapping` in `extension.js`) must update both `theme.fileNames` (for Dark) and `theme.light.fileNames` (for Light) so newly created `.java` interfaces/enums/records show the proper light badge in Light theme too.
- Installing v1.2.0 via `scripts/install-and-package.mjs` must remove legacy `elaand.jetbrains-intellij-new-ui-dark-*` folders and `extensions.json` entries so the IDE does not load duplicate extensions or duplicate keybindings.

---

### Task 1: Rename Extension Directory & Update Manifest (`jetbrains-intellij-new-ui-pro`)

**Files:**
- Modify: `jetbrains-intellij-new-ui-pro/package.json` (renamed from `jetbrains-intellij-new-ui-dark/package.json`)
- Modify: `jetbrains-intellij-new-ui-pro/README.md`
- Modify: `scripts/build-product-icons.py:8`
- Modify: `tests/manifest.test.mjs`
- Modify: `tests/product-icons.test.mjs`

**Interfaces:**
- Consumes: `jetbrains-intellij-new-ui-dark/` directory
- Produces: `jetbrains-intellij-new-ui-pro/package.json` (`name: "jetbrains-intellij-new-ui-pro"`, `displayName: "IntelliJ IDEA New UI (Pro)"`, `version: "1.2.0"`, 2 themes in `contributes.themes`)

- [ ] **Step 1: Move directory and write failing tests in `tests/manifest.test.mjs` and `tests/product-icons.test.mjs`**

Run `git mv jetbrains-intellij-new-ui-dark jetbrains-intellij-new-ui-pro`, update `PROD_DIR` in `scripts/build-product-icons.py` and `tests/product-icons.test.mjs` to `jetbrains-intellij-new-ui-pro/icons/product-icons`, and update `tests/manifest.test.mjs` to assert:

```javascript
  const uiPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'jetbrains-intellij-new-ui-pro/package.json'), 'utf8'));
  assert.equal(uiPkg.name, 'jetbrains-intellij-new-ui-pro');
  assert.equal(uiPkg.displayName, 'IntelliJ IDEA New UI (Pro)');
  assert.equal(uiPkg.publisher, 'elaand');
  assert.equal(uiPkg.version, '1.2.0');
  assert.equal(uiPkg.contributes.themes.length, 2);
  assert.deepEqual(uiPkg.contributes.themes[0], {
    id: 'IntelliJ IDEA New UI Dark (Pro)',
    label: 'IntelliJ IDEA New UI Dark (Pro)',
    uiTheme: 'vs-dark',
    path: './themes/intellij-new-ui-dark-pro.json'
  });
  assert.deepEqual(uiPkg.contributes.themes[1], {
    id: 'IntelliJ IDEA New UI Light (Pro)',
    label: 'IntelliJ IDEA New UI Light (Pro)',
    uiTheme: 'vs',
    path: './themes/intellij-new-ui-light-pro.json'
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/manifest.test.mjs tests/product-icons.test.mjs`
Expected: FAIL on `uiPkg.name === 'jetbrains-intellij-new-ui-pro'` and `themes.length === 2`.

- [ ] **Step 3: Update `jetbrains-intellij-new-ui-pro/package.json` and `README.md`**

In `jetbrains-intellij-new-ui-pro/package.json`:
- Set `"name": "jetbrains-intellij-new-ui-pro"`, `"displayName": "IntelliJ IDEA New UI (Pro)"`, `"version": "1.2.0"`.
- Add the second theme entry to `contributes.themes` with `id` and `label` `"IntelliJ IDEA New UI Light (Pro)"`, `uiTheme: "vs"`, `path: "./themes/intellij-new-ui-light-pro.json"`.
- Add `"light"` to `keywords`.
- Update `jetbrains-intellij-new-ui-pro/README.md` to document both `IntelliJ IDEA New UI Dark (Pro)` and `IntelliJ IDEA New UI Light (Pro)`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/manifest.test.mjs tests/product-icons.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add -A jetbrains-intellij-new-ui-dark jetbrains-intellij-new-ui-pro scripts/build-product-icons.py tests/manifest.test.mjs tests/product-icons.test.mjs
git commit -m "feat(manifest): rename extension to IntelliJ IDEA New UI (Pro) v1.2.0 and register Light theme"
```

---

### Task 2: Build `IntelliJ IDEA New UI Light (Pro)` Theme While Preserving Dark Theme 100%

**Files:**
- Modify: `scripts/build-theme.mjs`
- Create: `jetbrains-intellij-new-ui-pro/themes/intellij-new-ui-light-pro.json`
- Modify: `tests/theme.test.mjs`

**Interfaces:**
- Consumes: `jetbrains-intellij-new-ui-pro/themes/`
- Produces:
  - `jetbrains-intellij-new-ui-pro/themes/intellij-new-ui-dark-pro.json` (unchanged Dark theme)
  - `jetbrains-intellij-new-ui-pro/themes/intellij-new-ui-light-pro.json` (new Light theme)

- [ ] **Step 1: Write failing test for Light theme in `tests/theme.test.mjs`**

Update `DARK_THEME_PATH` in `tests/theme.test.mjs` to `jetbrains-intellij-new-ui-pro/themes/intellij-new-ui-dark-pro.json` (keeping every single Dark assertion untouched) and add a second `test(...)` block for `LIGHT_THEME_PATH` (`jetbrains-intellij-new-ui-pro/themes/intellij-new-ui-light-pro.json`):

```javascript
test('Light color theme matches exact JetBrains New UI Light (ExperimentalLight) palette and Java/TS semantic tokens', () => {
  const theme = JSON.parse(fs.readFileSync(LIGHT_THEME_PATH, 'utf8'));
  assert.equal(theme.name, 'IntelliJ IDEA New UI Light (Pro)');
  assert.equal(theme.type, 'light');
  assert.equal(theme.semanticHighlighting, true);

  // Core ExperimentalLight surfaces
  assert.equal(theme.colors['editor.background'].toUpperCase(), '#FFFFFF');
  assert.equal(theme.colors['editor.foreground'].toUpperCase(), '#080808');
  assert.equal(theme.colors['sideBar.background'].toUpperCase(), '#F7F8FA');
  assert.equal(theme.colors['activityBar.background'].toUpperCase(), '#EBECF0');
  assert.equal(theme.colors['statusBar.background'].toUpperCase(), '#F7F8FA');
  assert.equal(theme.colors['titleBar.activeBackground'].toUpperCase(), '#EBECF0');
  assert.equal(theme.colors['terminal.background'].toUpperCase(), '#FFFFFF');
  assert.equal(theme.colors['focusBorder'].toUpperCase(), '#3574F0');
  assert.equal(theme.colors['list.activeSelectionBackground'].toUpperCase(), '#D4E2FF');
  assert.equal(theme.colors['editor.selectionBackground'].toUpperCase(), '#A6D2FF');
  assert.equal(theme.colors['editor.lineHighlightBackground'].toUpperCase(), '#F5F8FE');
  assert.ok(Object.keys(theme.colors).length >= 320);

  // Semantic tokens matching JetBrains light.xml
  const sem = theme.semanticTokenColors;
  assert.equal(sem['keyword'].foreground.toUpperCase(), '#0033B3');
  assert.equal(sem['annotation'].foreground.toUpperCase(), '#9E880D');
  assert.equal(sem['decorator'].foreground.toUpperCase(), '#9E880D');
  assert.equal(sem['method.declaration'].foreground.toUpperCase(), '#00627A');
  assert.equal(sem['function.declaration'].foreground.toUpperCase(), '#00627A');
  assert.equal(sem['property'].foreground.toUpperCase(), '#871094');
  assert.equal(sem['property.readonly.static'].fontStyle, 'italic');
  assert.equal(sem['enumMember'].foreground.toUpperCase(), '#871094');
  assert.equal(sem['enumMember'].fontStyle, 'italic');
  assert.equal(sem['string'].foreground.toUpperCase(), '#067D17');
  assert.equal(sem['number'].foreground.toUpperCase(), '#1750EB');
  assert.equal(sem['typeParameter'].foreground.toUpperCase(), '#007E8A');
  assert.equal(sem['operator'].foreground.toUpperCase(), '#080808');
  assert.equal(sem['*.importDeclaration'].foreground.toUpperCase(), '#080808');

  // Anti-flicker TextMate alignment for Java imports/packages
  const typeRule = theme.tokenColors.find(r => r.name.includes('Classes, Interfaces, Types'));
  assert.ok(typeRule.scope.includes('storage.type.import.java'));
  assert.ok(typeRule.scope.includes('storage.type.package.java'));
  assert.equal(typeRule.settings.foreground.toUpperCase(), '#080808');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/theme.test.mjs`
Expected: FAIL with `ENOENT: no such file or directory, open '.../intellij-new-ui-light-pro.json'`.

- [ ] **Step 3: Update `scripts/build-theme.mjs` to generate both Dark and Light themes**

In `scripts/build-theme.mjs`:
- Point `DARK_OUT_PATH` to `jetbrains-intellij-new-ui-pro/themes/intellij-new-ui-dark-pro.json` and keep the `darkTheme` object 100% identical.
- Add `LIGHT_OUT_PATH` (`jetbrains-intellij-new-ui-pro/themes/intellij-new-ui-light-pro.json`) and define `lightTheme` with JetBrains `ExperimentalLight` (`light.xml`) workbench colors, `semanticTokenColors`, and `tokenColors`.
- Run `node scripts/build-theme.mjs`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/theme.test.mjs`
Expected: PASS (both Dark and Light tests pass).

- [ ] **Step 5: Commit**

```bash
git add scripts/build-theme.mjs jetbrains-intellij-new-ui-pro/themes/intellij-new-ui-dark-pro.json jetbrains-intellij-new-ui-pro/themes/intellij-new-ui-light-pro.json tests/theme.test.mjs
git commit -m "feat(theme): add IntelliJ IDEA New UI Light (Pro) theme while preserving Dark theme"
```

---

### Task 3: Add `expui` Light File Icons Variant & Preserve Selected Theme in `extension.js`

**Files:**
- Modify: `scripts/build-file-icons.mjs`
- Modify: `jetbrains-intellij-new-ui-pro/icons/file-icons/intellij-new-ui-file-icons.json`
- Create: `jetbrains-intellij-new-ui-pro/icons/file-icons/svgs/light/*.svg`
- Modify: `jetbrains-intellij-new-ui-pro/extension.js`
- Modify: `tests/file-icons.test.mjs`

**Interfaces:**
- Consumes: `jetbrains-intellij-new-ui-pro/icons/file-icons/`
- Produces:
  - `intellij-new-ui-file-icons.json` with untouched default/Dark definitions plus top-level `light` overrides pointing to `./svgs/light/*.svg`
  - `extension.js` exporting `{ activate, deactivate, classifyJavaContent, resolvePreferredIntelliJTheme }`

- [ ] **Step 1: Write failing tests in `tests/file-icons.test.mjs`**

Update paths in `tests/file-icons.test.mjs` to `jetbrains-intellij-new-ui-pro` and add assertions for:
1. `theme.light` exists in `intellij-new-ui-file-icons.json`, maps `file`, `folder`, `folderExpanded`, `folderNames`, `fileExtensions`, `fileNames`, and every `_light_*` icon in `theme.iconDefinitions` points to an existing 16x16 SVG in `svgs/light/`.
2. Dark SVGs (`svgs/java_class.svg`, `svgs/folder.svg`) still have their exact Dark fill colors (`#25324D`, `#393B40`).
3. `resolvePreferredIntelliJTheme` in `extension.js` preserves `'IntelliJ IDEA New UI Light (Pro)'` when already selected in settings, and defaults to `'IntelliJ IDEA New UI Dark (Pro)'` otherwise.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/file-icons.test.mjs`
Expected: FAIL because `theme.light` and `resolvePreferredIntelliJTheme` do not exist yet.

- [ ] **Step 3: Implement `light` icons in `scripts/build-file-icons.mjs` and theme preservation + light icon sync in `jetbrains-intellij-new-ui-pro/extension.js`**

1. In `scripts/build-file-icons.mjs`:
   - Update `ICON_DIR` to `jetbrains-intellij-new-ui-pro/icons/file-icons` and create `LIGHT_SVG_DIR = path.join(SVG_DIR, 'light')`.
   - Keep `SVGS` (Dark) 100% untouched.
   - Define `LIGHT_SVGS` using JetBrains `expui` Light fills/strokes (e.g. `_folder`: `#EBECF0`/`#6C707E`, `_java_class`: `#E7EFFD`/`#3574F0`, `_java_interface`: `#E5F4EA`/`#208A3C`, `_java_enum`: `#F2EBF9`/`#834DF0`, `_java_exception`: `#FFF4EB`/`#E56E17`, `_java_annotation`: `#FFF7E0`/`#9E880D`, `_file`: `#FFFFFF`/`#6C707E`), write them to `svgs/light/<name>.svg`, register `_light_<name>` in `iconDefinitions`, and add top-level `light` mapping helper `toLightMap(map)` (`val => val.replace(/^_/, '_light_')`).
   - Run `node scripts/build-file-icons.mjs`.
2. In `jetbrains-intellij-new-ui-pro/extension.js`:
   - Add `const INTELLIJ_THEMES = new Set(['IntelliJ IDEA New UI Dark (Pro)', 'IntelliJ IDEA New UI Light (Pro)']);` and `function resolvePreferredIntelliJTheme(currentTheme) { return INTELLIJ_THEMES.has(currentTheme) ? currentTheme : RECOMMENDED_SETTINGS['workbench.colorTheme']; }`.
   - In `writeWorkspaceSettingsAtomically` and `writeSettingsFileAtomically` when `mode === 'intellij'`, use `const targetVal = key === 'workbench.colorTheme' ? resolvePreferredIntelliJTheme(data[key]) : val;`.
   - In `applyJavaIconMapping(theme, baseName, iconId)`, also sync `theme.light.fileNames[baseName]` to `iconId.replace(/^_/, '_light_')` (or delete when `_java_class`) if `theme.light && theme.light.fileNames` exists.
   - Export `{ activate, deactivate, classifyJavaContent, resolvePreferredIntelliJTheme }`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/file-icons.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/build-file-icons.mjs jetbrains-intellij-new-ui-pro/icons/file-icons jetbrains-intellij-new-ui-pro/extension.js tests/file-icons.test.mjs
git commit -m "feat(icons,runtime): add expui Light file icons variant and preserve Dark/Light theme choice"
```

---

### Task 4: Package VSIX v1.2.0, Install in Antigravity IDE, Verify Suite & Push to GitHub

**Files:**
- Modify: `scripts/install-and-package.mjs`
- Modify: `tests/integration.test.mjs`
- Create: `dist/jetbrains-intellij-new-ui-pro-1.2.0.vsix`

**Interfaces:**
- Consumes: `jetbrains-intellij-new-ui-pro/`
- Produces: `dist/jetbrains-intellij-new-ui-pro-1.2.0.vsix`, updated `extensions.json` in `.antigravity` & `.antigravity-ide`, and pushed `main` branch on `https://github.com/Hieu4tuoii/IntelliJ-IDEA-New-UI-Pro-.git`

- [ ] **Step 1: Write failing test in `tests/integration.test.mjs`**

Update `tests/integration.test.mjs` to assert:
- `dist/jetbrains-intellij-new-ui-pro-1.2.0.vsix` exists and legacy `jetbrains-intellij-new-ui-dark-1.1.0.vsix` is removed.
- `elaand.jetbrains-intellij-new-ui-pro-1.2.0/package.json` is installed in both `.antigravity/extensions` and `.antigravity-ide/extensions`, registered as `elaand.jetbrains-intellij-new-ui-pro` v1.2.0, and legacy `elaand.jetbrains-intellij-new-ui-dark-*` folders/entries are removed.
- Both `themes/intellij-new-ui-dark-pro.json` and `themes/intellij-new-ui-light-pro.json` exist inside the installed extension folders.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/integration.test.mjs`
Expected: FAIL because `jetbrains-intellij-new-ui-pro-1.2.0.vsix` has not been built or installed yet.

- [ ] **Step 3: Update `scripts/install-and-package.mjs` and run packaging & installation**

In `scripts/install-and-package.mjs`:
- Remove legacy `dist/jetbrains-intellij-new-ui-dark-1.1.0.vsix`.
- Package `jetbrains-intellij-new-ui-pro` into `dist/jetbrains-intellij-new-ui-pro-1.2.0.vsix`.
- Remove legacy `elaand.jetbrains-intellij-new-ui-dark-*` folders and `elaand.jetbrains-intellij-new-ui-dark` registry entries from both `.antigravity/extensions` and `.antigravity-ide/extensions`.
- Install `elaand.jetbrains-intellij-new-ui-pro-1.2.0` and preserve either `'IntelliJ IDEA New UI Dark (Pro)'` or `'IntelliJ IDEA New UI Light (Pro)'` in `User/settings.json`.
- Run `node scripts/install-and-package.mjs`.

- [ ] **Step 4: Run full test suite to verify everything passes**

Run: `npm test`
Expected: All 5 test files (`file-icons.test.mjs`, `integration.test.mjs`, `manifest.test.mjs`, `product-icons.test.mjs`, `theme.test.mjs`) PASS with 0 failures.

- [ ] **Step 5: Commit and push to GitHub (`main`)**

```bash
git add -A
git commit -m "chore(release): package jetbrains-intellij-new-ui-pro v1.2.0 and clean up legacy dark id"
git branch -M main
git remote add origin https://github.com/Hieu4tuoii/IntelliJ-IDEA-New-UI-Pro-.git
git push -u origin main
```
