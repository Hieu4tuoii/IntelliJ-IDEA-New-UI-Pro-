import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const ICON_DIR = path.join(ROOT, 'jetbrains-intellij-new-ui-pro/icons/file-icons');
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

  // File name mappings (including Spring, Maven, GitLab, Ignore, IML & Java patterns matching official IntelliJ New UI)
  assert.equal(theme.fileNames['pom.xml'], '_maven');
  assert.equal(theme.fileNames['mvnw'], '_shell');
  assert.equal(theme.fileNames['mvnw.cmd'], '_text');
  assert.equal(theme.fileNames['.gitignore'], '_ignored');
  assert.equal(theme.fileNames['.gitlab-ci.yml'], '_gitlab');
  assert.equal(theme.fileExtensions['iml'], '_iml');
  assert.equal(theme.fileExtensions['class'], '_java_compiled');
  assert.equal(theme.fileNames['application.yml'], '_spring');
  assert.equal(theme.fileNames['application.properties'], '_spring');
  assert.equal(theme.fileNames['cardapplication.java'], '_java_runnable');
  assert.equal(theme.fileNames['createattachmentserviceimpl.java'], '_java_class');
  assert.equal(theme.fileNames['createattachmentservice.java'], '_java_interface');
  assert.equal(theme.fileNames['equal.java'], '_java_annotation', '@interface Equal.java must map to _java_annotation');
  assert.notEqual(theme.fileNames['loginrequest.java'], '_java_record', 'Class LoginRequest.java must not be _java_record');
  assert.notEqual(theme.fileNames['baseresponse.java'], '_java_record', 'Class BaseResponse.java must not be _java_record');
  assert.notEqual(theme.fileNames['mailserviceimpl.java'], '_java_record', 'Class MailServiceImpl.java must not be _java_record');
  assert.notEqual(theme.fileNames['workflowserviceimpl.java'], '_java_record', 'Class WorkflowServiceImpl.java must not be _java_record');
  assert.equal(theme.fileNames['queuemessagebase.java'], '_java_record', 'Actual Java record QueueMessageBase.java must be _java_record');
  assert.ok(Object.keys(theme.fileNames).length < 600, `fileNames should be compacted without redundant _java_class bloat, got ${Object.keys(theme.fileNames).length}`);

  // Official JetBrains expui Dark SVGs verification
  const darkJavaClassSvg = fs.readFileSync(path.resolve(ICON_DIR, theme.iconDefinitions._java_class.iconPath), 'utf8');
  assert.match(darkJavaClassSvg, /fill="#25324D"/, 'Dark _java_class SVG fill must use official expui (#25324D)');
  assert.match(darkJavaClassSvg, /stroke="#548AF7"/, 'Dark _java_class SVG stroke must use official expui (#548AF7)');
  const darkRunnableSvg = fs.readFileSync(path.resolve(ICON_DIR, theme.iconDefinitions._java_runnable.iconPath), 'utf8');
  assert.match(darkRunnableSvg, /#57965C/, 'Dark _java_runnable SVG must include official runnableMark green badge (#57965C)');
  const darkFinalSvg = fs.readFileSync(path.resolve(ICON_DIR, theme.iconDefinitions._java_final_class.iconPath), 'utf8');
  assert.match(darkFinalSvg, /#CED0D6/, 'Dark _java_final_class SVG must include official finalMark pin (#CED0D6)');

  // Light theme icon variant must exist and map light expui SVGs without affecting Dark
  assert.ok(theme.light, 'File icon theme must include a top-level light override object');
  assert.equal(theme.light.file, '_light_file');
  assert.equal(theme.light.folder, '_light_folder');
  assert.equal(theme.light.folderExpanded, '_light_folder_open');
  assert.equal(theme.light.folderNames['java'], '_light_folder_java');
  assert.equal(theme.light.fileExtensions['java'], '_light_java_class');
  assert.equal(theme.light.fileNames['pom.xml'], '_light_maven');
  assert.equal(theme.light.fileNames['createattachmentservice.java'], '_light_java_interface');
  const lightJavaClassSvg = fs.readFileSync(path.resolve(ICON_DIR, theme.iconDefinitions._light_java_class.iconPath), 'utf8');
  assert.match(lightJavaClassSvg, /fill="#E7EFFD"/, 'Light _light_java_class SVG must use expui Light blue tint (#E7EFFD)');
});

test('Runtime extension.js classifyJavaContent and scanWorkspaceJavaIcons auto-scan workspace Java files on startup', async () => {
  const extSrc = fs.readFileSync(
    path.join(ROOT, 'jetbrains-intellij-new-ui-pro/extension.js'),
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
  const { classifyJavaContent, resolvePreferredIntelliJTheme, applyJavaIconMapping } = requireCjs(path.join(ROOT, 'jetbrains-intellij-new-ui-pro/extension.js'));
  Module._load = origLoad;

  const mockTheme = { fileNames: {}, light: { fileNames: {} } };
  assert.equal(applyJavaIconMapping(mockTheme, 'orderservice.java', '_java_interface'), true);
  assert.equal(mockTheme.fileNames['orderservice.java'], '_java_interface');
  assert.equal(mockTheme.light.fileNames['orderservice.java'], '_light_java_interface');
  assert.equal(applyJavaIconMapping(mockTheme, 'orderservice.java', '_java_class'), true);
  assert.equal(mockTheme.fileNames['orderservice.java'], undefined);
  assert.equal(mockTheme.light.fileNames['orderservice.java'], undefined);

  assert.equal(
    resolvePreferredIntelliJTheme('IntelliJ IDEA New UI Light (Pro)'),
    'IntelliJ IDEA New UI Light (Pro)',
    'Selecting Light theme in IDE menu must be preserved by extension.js'
  );
  assert.equal(
    resolvePreferredIntelliJTheme('IntelliJ IDEA New UI Dark (Pro)'),
    'IntelliJ IDEA New UI Dark (Pro)',
    'Dark theme selection must be preserved by extension.js'
  );
  assert.equal(
    resolvePreferredIntelliJTheme('Default Dark+'),
    'IntelliJ IDEA New UI Dark (Pro)',
    'Non-IntelliJ theme must default to IntelliJ IDEA New UI Dark (Pro) when applying IntelliJ mode'
  );

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
  assert.equal(
    classifyJavaContent('package a.b;\n@SpringBootApplication\npublic class CardApplication {\n  public static void main(String[] args) {}\n}', 'CardApplication.java'),
    '_java_runnable',
    'Runnable class with @SpringBootApplication or main method must receive _java_runnable'
  );
  assert.equal(
    classifyJavaContent('package a.b;\npublic final class Constants {\n}', 'Constants.java'),
    '_java_final_class',
    'Final class must receive _java_final_class'
  );
});

