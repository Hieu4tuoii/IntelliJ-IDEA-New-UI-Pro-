import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ICON_DIR = 'C:/Users/ADMIN/.antigravity-extensions-src/jetbrains-intellij-new-ui-dark/icons/file-icons';
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

  // Folder mappings
  assert.equal(theme.folderNames['src'], '_folder_src');
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
});
