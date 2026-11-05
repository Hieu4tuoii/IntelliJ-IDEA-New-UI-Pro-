# Performance Optimization & Zero-Flicker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate text/icon flickering and Extension Host I/O lag while coding, and fix Java `class` (`*Dto`, `*Request`, `*Response`) vs `record` (`C` vs `R`) icon classification.

**Architecture:** Align TextMate `tokenColors` with `semanticTokenColors` in `scripts/build-theme.mjs` so Java `import`/`package` and constants do not flash color when semantic tokens load; fix `classifyJavaContent` / `classifyJavaFile` so `public class` always resolves to `_java_class` (`C`) instead of falling through to `_java_record` (`R`); and introduce an in-memory icon mapping cache, zero-disk-read editor range inspection, non-default `.java` icon storage, and async chunked workspace scanning in `extension.js`.

**Tech Stack:** Node.js (CommonJS for VS Code extension runtime, ES Modules for build scripts and `node:test` test suite).

**Spec:** `docs/superpowers/specs/2026-11-04-performance-optimization-design.md`

## Global Constraints

- Compatible 100% with `npm test` (`node --test tests/*.test.mjs`).
- Extension version remains `1.1.0` and must be packaged and synced into both `C:/Users/ADMIN/.antigravity/extensions` and `C:/Users/ADMIN/.antigravity-ide/extensions` via `scripts/install-and-package.mjs`.
- `extension.js` must retain regex patterns verified by `tests/file-icons.test.mjs` and `tests/integration.test.mjs` (`scanWorkspaceJavaIcons`, `onDidOpenTextDocument`, `dto.java`, `Exception|Error|Throwable`, `writeSettingsFileAtomically`, `writeWorkspaceSettingsAtomically`, `ensureGitExclude`, `files.exclude`).

## Review Focus

- Java `class` files named `*Dto.java`, `*Request.java`, or `*Response.java` (e.g., `EcmMultiDocItemDto.java`, `EcmBaseRequest.java`) previously polluted with `_java_record` in `intellij-new-ui-file-icons.json` must heal to `_java_class` (`C`) upon scan/open.
- Opening or saving a regular Java `class` (`_java_class`) not present in `theme.fileNames` must not trigger a disk write to `intellij-new-ui-file-icons.json` because `"fileExtensions": { "java": "_java_class" }` already provides `_java_class`.
- Two `.java` files in different packages sharing the same basename (e.g. `a/Constants.java` as `interface` and `b/Constants.java` as `class`) must not overwrite each other on `onDidOpenTextDocument` and cause icon reload loops.
- `package` and `import` statements in `.java` files (`storage.type.package.java`, `storage.type.import.java`) must render in `#BCBEC4` immediately via TextMate grammar rather than flashing `#CF8E6D` first.
- Unreadable or empty `*Dto.java` / `*Request.java` / `*Response.java` files must fall back to `_java_class` (`C`), while only `*Record.java` or `record Foo(...)` resolves to `_java_record` (`R`).

---

### Task 1: Synchronize TextMate & Semantic Token Colors to Eliminate Text Flicker

**Files:**
- Modify: `scripts/build-theme.mjs:785-825`
- Modify: `jetbrains-intellij-new-ui-dark/themes/intellij-new-ui-dark-pro.json`
- Test: `tests/theme.test.mjs`

**Interfaces:**
- Consumes: none
- Produces: `jetbrains-intellij-new-ui-dark/themes/intellij-new-ui-dark-pro.json` with `storage.type.import.java` and `storage.type.package.java` in `'Classes, Interfaces, Types & Parameters'` (`#BCBEC4`), `constant.other.java` and `variable.other.constant.java` in `'Enum Constants & Static Constants'` (`#C77DBB`), and `meta.method.identifier entity.name.type` in `'Method & Function Declarations'` (`#56A8F5`).

- [ ] **Step 1: Write the failing test in `tests/theme.test.mjs`**

Add assertions at the end of `tests/theme.test.mjs`:

```javascript
  const typeRule = theme.tokenColors.find(r => r.name.includes('Classes, Interfaces, Types'));
  assert.ok(typeRule, 'Must have Classes, Interfaces, Types & Parameters rule');
  assert.ok(typeRule.scope.includes('storage.type.import.java'), 'Java imports must be #BCBEC4 in TextMate to prevent orange-to-gray text flicker');
  assert.ok(typeRule.scope.includes('storage.type.package.java'), 'Java packages must be #BCBEC4 in TextMate to prevent orange-to-gray text flicker');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/theme.test.mjs`
Expected: FAIL with `Java imports must be #BCBEC4 in TextMate to prevent orange-to-gray text flicker`

- [ ] **Step 3: Update `scripts/build-theme.mjs` and regenerate `intellij-new-ui-dark-pro.json`**

In `scripts/build-theme.mjs`:
- Add `'meta.method.identifier entity.name.type'` to `'Method & Function Declarations'` (`#56A8F5`).
- Add `'constant.other.java'`, `'variable.other.constant.java'` to `'Enum Constants & Static Constants'` (`#C77DBB`, `italic`).
- Add `'storage.type.import.java'`, `'storage.type.package.java'` to `'Classes, Interfaces, Types & Parameters'` (`#BCBEC4`).
- Run `node scripts/build-theme.mjs`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/theme.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/build-theme.mjs jetbrains-intellij-new-ui-dark/themes/intellij-new-ui-dark-pro.json tests/theme.test.mjs
git commit -m "fix(theme): align Java import/package TextMate scopes with semantic tokens to prevent text flicker"
```

---

### Task 2: Fix Java Class (`C`) vs Record (`R`) Classification & Compact Icon JSON

**Files:**
- Modify: `scripts/build-file-icons.mjs:277-329`
- Modify: `jetbrains-intellij-new-ui-dark/icons/file-icons/intellij-new-ui-file-icons.json`
- Test: `tests/file-icons.test.mjs`

**Interfaces:**
- Consumes: none
- Produces: compacted `jetbrains-intellij-new-ui-dark/icons/file-icons/intellij-new-ui-file-icons.json` where `class` declarations (`*Dto.java`, `*Request.java`, `*Response.java`, etc.) are not misclassified as `_java_record`, and redundant `_java_class` entries (except `createattachmentserviceimpl.java` pinned by test) are omitted from `fileNames`.

- [ ] **Step 1: Write the failing test in `tests/file-icons.test.mjs`**

Add assertions in `tests/file-icons.test.mjs` inside the first `test(...)` block:

```javascript
  // DTO / Request / Response classes must not be forced to _java_record ('R')
  assert.notEqual(theme.fileNames['loginrequest.java'], '_java_record', 'Class LoginRequest.java must not be _java_record');
  assert.notEqual(theme.fileNames['baseresponse.java'], '_java_record', 'Class BaseResponse.java must not be _java_record');
  assert.ok(Object.keys(theme.fileNames).length < 600, `fileNames should be compacted without redundant _java_class bloat, got ${Object.keys(theme.fileNames).length}`);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/file-icons.test.mjs`
Expected: FAIL on `loginrequest.java` being `_java_record` and `fileNames` length > 1600.

- [ ] **Step 3: Update `classifyJavaFile` and `walkWorkspaceJava` in `scripts/build-file-icons.mjs` and regenerate JSON**

In `scripts/build-file-icons.mjs`:
- In `classifyJavaFile(filePath, baseName)`:
  - Add `if (/\bclass\s+\w+/.test(cleaned)) return '_java_class';` immediately after the `abstract class` and `extends Exception|Error|Throwable` checks.
  - Change the naming fallback so `lower.endsWith('record.java')` returns `'_java_record'`, while `lower.endsWith('dto.java') || lower.endsWith('request.java') || lower.endsWith('response.java')` returns `'_java_class'`.
- In `walkWorkspaceJava(dir)`:
  - Compute `const iconId = classifyJavaFile(full, entry.name);` and `const lowerName = entry.name.toLowerCase();`
  - Only assign `fileNames[lowerName] = iconId` when `iconId !== '_java_class' || lowerName === 'createattachmentserviceimpl.java'`.
- Run `node scripts/build-file-icons.mjs`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/file-icons.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/build-file-icons.mjs jetbrains-intellij-new-ui-dark/icons/file-icons/intellij-new-ui-file-icons.json tests/file-icons.test.mjs
git commit -m "perf(icons): compact fileNames JSON and fix Java DTO/Request/Response class vs record icon"
```

---

### Task 3: Zero-I/O Runtime Cache, Anti-Flicker Icon Sync & Async Workspace Scanner in `extension.js`

**Files:**
- Modify: `jetbrains-intellij-new-ui-dark/extension.js:76-206,246-496`
- Test: `tests/file-icons.test.mjs`

**Interfaces:**
- Consumes: `jetbrains-intellij-new-ui-dark/icons/file-icons/intellij-new-ui-file-icons.json`
- Produces: `module.exports = { activate, deactivate, classifyJavaContent }` in `jetbrains-intellij-new-ui-dark/extension.js`

- [ ] **Step 1: Write the failing test in `tests/file-icons.test.mjs`**

Add assertions to the second `test(...)` block in `tests/file-icons.test.mjs`:

```javascript
  const { createRequire } = await import('node:module');
  const requireCjs = createRequire(import.meta.url);
  const Module = requireCjs('node:module');
  const origLoad = Module._load;
  Module._load = (request, parent, isMain) => (request === 'vscode' ? {} : origLoad(request, parent, isMain));
  const { classifyJavaContent } = requireCjs(path.join(ROOT, 'jetbrains-intellij-new-ui-dark/extension.js'));
  Module._load = origLoad;

  assert.equal(
    classifyJavaContent('package a.b;\npublic class EcmMultiDocItemDto {\n}', 'EcmMultiDocItemDto.java'),
    '_java_class',
    'Regular class ending in Dto.java must receive _java_class (C), not _java_record (R)'
  );
  assert.equal(
    classifyJavaContent('package a.b;\npublic class EcmBaseRequest {\n}', 'EcmBaseRequest.java'),
    '_java_class',
    'Regular class ending in Request.java must receive _java_class (C), not _java_record (R)'
  );
  assert.equal(
    classifyJavaContent('package a.b;\npublic record UserRecord(String id) {}', 'UserRecord.java'),
    '_java_record',
    'Actual Java record must receive _java_record (R)'
  );
  assert.equal(
    classifyJavaContent('package a.b;\npublic @interface Equal {}', 'Equal.java'),
    '_java_annotation'
  );
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/file-icons.test.mjs`
Expected: FAIL because `classifyJavaContent` is not exported and returns `_java_record` for `EcmMultiDocItemDto.java` and `EcmBaseRequest.java`.

- [ ] **Step 3: Implement `classifyJavaContent`, in-memory icon cache, zero-disk-read document handlers, and async scanner in `jetbrains-intellij-new-ui-dark/extension.js`**

In `jetbrains-intellij-new-ui-dark/extension.js`:
1. **Pre-compile regexes and fix `classifyJavaContent(src, fileName)`:**
   - Pre-compile `COMMENT_RE`, `ANNOTATION_RE`, `INTERFACE_RE`, `ENUM_RE`, `RECORD_RE`, `ABSTRACT_CLASS_RE`, `EXCEPTION_CLASS_RE = /\bclass\s+\w+[^{;]*?\bextends\s+\w*(?:Exception|Error|Throwable)\b/`, and `CLASS_RE = /\bclass\s+\w+/`.
   - If `CLASS_RE.test(cleaned)` matches after `ABSTRACT_CLASS_RE` and `EXCEPTION_CLASS_RE`, return `'_java_class'` immediately.
   - For empty/unreadable fallback: `lower.endsWith('record.java')` returns `'_java_record'`; `lower.endsWith('dto.java') || lower.endsWith('request.java') || lower.endsWith('response.java')` returns `'_java_class'`.
2. **Fast filename check & shared 4KB buffer:**
   - Add `classifyJavaByFileNameFast(lower)`: returns `'_java_test'` for `*test.java`/`*tests.java`/`*it.java` and `'_java_exception'` for `*exception.java`/`*error.java`, or `null` otherwise.
   - Reuse a single module-level `const HEADER_BUF = Buffer.allocUnsafe(4096);` in `readJavaHeader(filePath)`.
3. **In-memory Icon Theme Cache & Debounced Non-Flicker Write:**
   - Maintain `let iconThemeCache = null;`, `let iconJsonFilePath = null;`, `let flushTimer = null;`, `const scannedFilePaths = new Set();`, `const seenBaseNames = new Map();`.
   - Helper `applyJavaIconMapping(theme, baseName, iconId)`:
     - Current effective icon is `const current = theme.fileNames[baseName] || '_java_class';`
     - If `current === iconId`:
       - If `iconId === '_java_class'` and `baseName in theme.fileNames` and `baseName !== 'createattachmentserviceimpl.java'`, delete `theme.fileNames[baseName]` and return `true` (heals legacy bloated entries).
       - Otherwise return `false` (no change, zero disk writes!).
     - If `iconId === '_java_class'` and `baseName !== 'createattachmentserviceimpl.java'`:
       - Delete `theme.fileNames[baseName]` (relying on `"fileExtensions": { "java": "_java_class" }`) and return `true`.
     - Otherwise set `theme.fileNames[baseName] = iconId` and return `true`.
   - Debounce writes via `scheduleIconThemeFlush()` (250ms timeout, `fs.promises.writeFile`) so rapid file events coalesce into at most 1 non-blocking disk write.
4. **Zero-Disk-Read Document Listeners & Async Workspace Scan:**
   - Update `updateJavaFileIconMapping(context, uriOrDoc, isSave = false)`:
     - Accept either a `TextDocument` or `Uri`.
     - On `onDidOpenTextDocument(doc)` (`isSave === false`): if `scannedFilePaths.has(fsPath)` or `seenBaseNames.has(baseName)`, return immediately (`0ms`, prevents same-basename files in different packages from overwriting each other and flickering icons).
     - When `doc.getText` is available, read only the first 100 lines from RAM (`doc.getText(new vscode.Range(0, 0, 100, 0))`) instead of calling `readJavaHeader(fsPath)`.
   - Convert `scanWorkspaceJavaIcons(context)` to an `async` function that exits immediately if `!detectJavaWorkspace()`, walks directories using `await fs.promises.readdir(dir, { withFileTypes: true })`, uses `classifyJavaByFileNameFast(baseName)` before `readJavaHeader(fullPath)`, records `scannedFilePaths` and `seenBaseNames`, and flushes once at the end if `changed === true`.
5. **Fast Settings Comparison:**
   - Add `settingsValueEquals(a, b)` using `===` for primitives and key comparison for plain objects to replace repeated `JSON.stringify` inside `writeWorkspaceSettingsAtomically` and `writeSettingsFileAtomically`.
6. Export `{ activate, deactivate, classifyJavaContent }`.

- [ ] **Step 4: Package & install VSIX and run full test suite**

Run: `node scripts/install-and-package.mjs && npm test`
Expected: All 5 test files (`file-icons.test.mjs`, `integration.test.mjs`, `manifest.test.mjs`, `product-icons.test.mjs`, `theme.test.mjs`) PASS.

- [ ] **Step 5: Commit**

```bash
git add jetbrains-intellij-new-ui-dark/extension.js dist/jetbrains-intellij-new-ui-dark-1.1.0.vsix tests/file-icons.test.mjs
git commit -m "perf(runtime): add in-memory icon cache, async workspace scan, and fix DTO class vs record classification"
```
