import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const ICON_DIR = path.join(ROOT, 'jetbrains-intellij-new-ui-dark/icons/file-icons');
const JSON_PATH = path.join(ICON_DIR, 'intellij-new-ui-file-icons.json');

test('File icon theme defines valid 16x16 SVGs and maps Java/Spring/FE files accurately', () => {
  const theme = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  assert.ok(theme.iconDefinitions._folder);
  assert.ok(theme.iconDefinitions._java_class);
  assert.ok(theme.iconDefinitions._java_interface);
  assert.ok(theme.iconDefinitions._java_enum);
  assert.ok(theme.iconDefinitions._java_exception);
  assert.ok(theme.iconDefinitions._java_record);
  assert.ok(theme.iconDefinitions._spring);
  assert.ok(theme.iconDefinitions._maven);

  // Every iconDefinition must point to an existing, non-empty 16x16 SVG file
  for (const [id, def] of Object.entries(theme.iconDefinitions)) {
    const svgPath = path.resolve(ICON_DIR, def.iconPath);
    assert.ok(fs.existsSync(svgPath), `Missing SVG for ${id}: ${svgPath}`);
    const content = fs.readFileSync(svgPath, 'utf8');
    assert.match(content, /viewBox="0 0 16 16"/, `SVG ${id} must have 16x16 viewBox`);
  }

  // Folder mappings (matching IntelliJ Maven/Gradle project tree: java/kotlin = blue source root, src/main/config = standard gray folder)
  assert.equal(theme.folderNames['src'], undefined);
  assert.equal(theme.folderNames['main'], undefined);
  assert.equal(theme.folderNames['config'], undefined);
  assert.equal(theme.folderNames['java'], '_folder_java');
  assert.equal(theme.folderNames['test'], '_folder_test');
  assert.equal(theme.folderNames['resources'], '_folder_resources');
  assert.equal(theme.folderNames['target'], '_folder_excluded');

  // File name mappings (including Spring, Maven & lendingfo Java patterns)
  assert.equal(theme.fileNames['pom.xml'], '_maven');
  assert.equal(theme.fileNames['application.yml'], '_spring');
  assert.equal(theme.fileNames['application.properties'], '_spring');
  assert.equal(theme.fileNames['createattachmentserviceimpl.java'], '_java_class');
  assert.equal(theme.fileNames['createattachmentservice.java'], '_java_interface');
  assert.equal(theme.fileNames['equal.java'], '_java_annotation', '@interface Equal.java must map to _java_annotation');
  assert.notEqual(theme.fileNames['loginrequest.java'], '_java_record', 'Class LoginRequest.java must not be _java_record');
  assert.notEqual(theme.fileNames['baseresponse.java'], '_java_record', 'Class BaseResponse.java must not be _java_record');
  assert.ok(Object.keys(theme.fileNames).length < 600, `fileNames should be compacted without redundant _java_class bloat, got ${Object.keys(theme.fileNames).length}`);
});

test('Runtime extension.js classifyJavaContent and scanWorkspaceJavaIcons auto-scan workspace Java files on startup', async () => {
  const extSrc = fs.readFileSync(
    path.join(ROOT, 'jetbrains-intellij-new-ui-dark/extension.js'),
    'utf8'
  );
  assert.doesNotMatch(extSrc, /\\b@interface/, 'extension.js must not use broken \\b@interface regex');
  assert.match(extSrc, /dto\.java/, 'extension.js must include DTO naming fallback');
  assert.match(extSrc, /scanWorkspaceJavaIcons/, 'extension.js must auto-scan workspace Java files on startup');
  assert.match(extSrc, /onDidOpenTextDocument/, 'extension.js must update Java icon mapping on open document as well');
  assert.match(extSrc, /Exception\|Error\|Throwable/, 'extension.js must detect classes extending Exception/Error/Throwable');

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
});

