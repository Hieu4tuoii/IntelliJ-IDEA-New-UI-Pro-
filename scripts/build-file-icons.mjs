import fs from 'node:fs';
import path from 'node:path';

const ICON_DIR = 'C:/Users/ADMIN/.antigravity-extensions-src/jetbrains-intellij-new-ui-dark/icons/file-icons';
const SVG_DIR = path.join(ICON_DIR, 'svgs');
const JSON_PATH = path.join(ICON_DIR, 'intellij-new-ui-file-icons.json');

fs.mkdirSync(SVG_DIR, { recursive: true });

// Helper for crisp 16x16 JetBrains expui SVGs
const svgWrap = (inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">${inner}</svg>`;

// Folder SVG generator (JetBrains expui rounded folder silhouette)
const folderSvg = (fill, stroke, badge = '') => svgWrap(`
  <path d="M1.5 4C1.5 3.17157 2.17157 2.5 3 2.5H6.17157C6.5694 2.5 6.95093 2.65804 7.23223 2.93934L8.29289 4H13C13.8284 4 14.5 4.67157 14.5 5.5V12C14.5 12.8284 13.8284 13.5 13 13.5H3C2.17157 13.5 1.5 12.8284 1.5 12V4Z" fill="${fill}" stroke="${stroke}" stroke-width="1"/>
  ${badge}
`);

const folderOpenSvg = (fill, stroke, badge = '') => svgWrap(`
  <path d="M1.5 4C1.5 3.17157 2.17157 2.5 3 2.5H6.17157C6.5694 2.5 6.95093 2.65804 7.23223 2.93934L8.29289 4H13C13.8284 4 14.5 4.67157 14.5 5.5V6.5H3.2L1.5 12V4Z" fill="${fill}" stroke="${stroke}" stroke-width="1"/>
  <path d="M2.8 6.5H15L13.4 13.5H1.5L2.8 6.5Z" fill="${fill}" stroke="${stroke}" stroke-width="1" stroke-linejoin="round"/>
  ${badge}
`);

// Circle badge with symbol (JetBrains expui Java Class / Interface / Enum / Annotation / Exception)
const circleBadgeSvg = (bgFill, borderStroke, innerPath) => svgWrap(`
  <circle cx="8" cy="8" r="6" fill="${bgFill}" stroke="${borderStroke}" stroke-width="1"/>
  ${innerPath}
`);

// Rounded doc / square badge for file types
const fileBadgeSvg = (bgFill, borderStroke, innerPath) => svgWrap(`
  <rect x="2" y="2" width="12" height="12" rx="2.5" fill="${bgFill}" stroke="${borderStroke}" stroke-width="1"/>
  ${innerPath}
`);

const SVGS = {
  // Folders (JetBrains New UI expui folder palette)
  _folder: folderSvg('#393B40', '#9DA0A8'),
  _folder_open: folderOpenSvg('#393B40', '#CED0D6'),
  _folder_src: folderSvg('#25324D', '#3574F0'),
  _folder_src_open: folderOpenSvg('#25324D', '#56A8F5'),
  _folder_java: folderSvg('#25324D', '#3574F0'),
  _folder_java_open: folderOpenSvg('#25324D', '#56A8F5'),
  _folder_test: folderSvg('#253B2F', '#59A869'),
  _folder_test_open: folderOpenSvg('#253B2F', '#6AAB73'),
  _folder_resources: folderSvg('#3D3526', '#E0A82E', `<rect x="10" y="9" width="3" height="3" rx="0.5" fill="#E0A82E"/>`),
  _folder_resources_open: folderOpenSvg('#3D3526', '#F2C55C', `<rect x="10" y="9" width="3" height="3" rx="0.5" fill="#F2C55C"/>`),
  _folder_excluded: folderSvg('#3F2E26', '#E08855'),
  _folder_excluded_open: folderOpenSvg('#3F2E26', '#E08855'),
  _folder_config: folderSvg('#2B2D30', '#6F737A', `<circle cx="11.5" cy="10" r="1.8" stroke="#9DA0A8" stroke-width="1"/>`),
  _folder_config_open: folderOpenSvg('#2B2D30', '#9DA0A8', `<circle cx="11.5" cy="10" r="1.8" stroke="#CED0D6" stroke-width="1"/>`),

  // Default file
  _file: svgWrap(`
    <path d="M3.5 2.5C3.5 1.94772 3.94772 1.5 4.5 1.5H9.79289L12.5 4.20711V13.5C12.5 14.0523 12.0523 14.5 11.5 14.5H4.5C3.94772 14.5 3.5 14.0523 3.5 13.5V2.5Z" fill="#2B2D30" stroke="#9DA0A8" stroke-width="1"/>
    <path d="M9.5 1.5V4.5H12.5" stroke="#9DA0A8" stroke-width="1"/>
  `),

  // Java Class (Blue 'C' circle - expui/nodes/class.svg)
  _java_class: circleBadgeSvg('#25324D', '#3574F0', `
    <path d="M10.2 5.8C9.7 5.2 8.9 4.9 8.1 4.9C6.4 4.9 5.2 6.2 5.2 8C5.2 9.8 6.4 11.1 8.1 11.1C8.9 11.1 9.7 10.8 10.2 10.2" stroke="#56A8F5" stroke-width="1.5" stroke-linecap="round"/>
  `),

  // Java Interface (Green 'I' circle - expui/nodes/interface.svg)
  _java_interface: circleBadgeSvg('#253B2F', '#59A869', `
    <path d="M6.5 5H9.5M8 5V11M6.5 11H9.5" stroke="#6AAB73" stroke-width="1.5" stroke-linecap="round"/>
  `),

  // Java Enum (Purple 'E' circle - expui/nodes/enum.svg)
  _java_enum: circleBadgeSvg('#35293E', '#9876AA', `
    <path d="M9.8 5H6.3V11H9.8M6.3 8H9.2" stroke="#C77DBB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `),

  // Java Abstract Class (Blue/Gray split 'C' - expui/nodes/abstractClass.svg)
  _java_abstract: svgWrap(`
    <circle cx="8" cy="8" r="6" fill="#25324D" stroke="#3574F0" stroke-width="1"/>
    <path d="M8 2A6 6 0 0 1 14 8H8V2Z" fill="#393B40"/>
    <path d="M10.2 5.8C9.7 5.2 8.9 4.9 8.1 4.9C6.4 4.9 5.2 6.2 5.2 8C5.2 9.8 6.4 11.1 8.1 11.1C8.9 11.1 9.7 10.8 10.2 10.2" stroke="#56A8F5" stroke-width="1.5" stroke-linecap="round"/>
  `),

  // Java Record / DTO (Blue 'R' circle - expui/nodes/record.svg)
  _java_record: circleBadgeSvg('#25324D', '#3574F0', `
    <path d="M6.2 11V5H8.5C9.5 5 10.1 5.6 10.1 6.5C10.1 7.4 9.5 8 8.5 8H6.2M8.2 8L10.1 11" stroke="#56A8F5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
  `),

  // Java Exception (Orange Lightning circle - expui/nodes/exceptionClass.svg)
  _java_exception: circleBadgeSvg('#3F2E26', '#E08855', `
    <path d="M8.7 4.2L5.5 8.5H8.1L7.3 11.8L10.5 7.5H7.9L8.7 4.2Z" fill="#E08855"/>
  `),

  // Java Annotation ('@' Olive/Gold circle - expui/nodes/annotationtype.svg)
  _java_annotation: circleBadgeSvg('#3D3526', '#B3AE60', `
    <circle cx="8" cy="8" r="1.8" stroke="#E0A82E" stroke-width="1.2"/>
    <path d="M9.8 6.2V8.8C9.8 9.6 10.4 10 11 9.6C11.6 9.1 11.8 7.5 11.2 6.1C10.5 4.6 8.5 4.1 6.7 4.7C4.8 5.3 4.1 7.5 4.8 9.4C5.5 11.2 7.7 11.8 9.6 11.2" stroke="#E0A82E" stroke-width="1.1" stroke-linecap="round"/>
  `),

  // Java Test Class (Class + Green/Red JUnit run badge)
  _java_test: svgWrap(`
    <circle cx="7.5" cy="7.5" r="5.5" fill="#25324D" stroke="#3574F0" stroke-width="1"/>
    <path d="M9.5 5.5C9 5 8.3 4.7 7.6 4.7C6.1 4.7 5 5.9 5 7.5C5 9.1 6.1 10.3 7.6 10.3C8.3 10.3 9 10 9.5 9.5" stroke="#56A8F5" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M11 9.5L15 12L11 14.5V9.5Z" fill="#59A869"/>
  `),

  // Spring Boot (Official green leaf hexagon)
  _spring: svgWrap(`
    <path d="M8 1.5L13.5 4.7V11.3L8 14.5L2.5 11.3V4.7L8 1.5Z" fill="#253B2F" stroke="#6DB33F" stroke-width="1"/>
    <path d="M11.2 5.2C8.2 5.2 5.2 6.8 5.2 9.8C5.2 10.5 5.6 11 5.6 11C5.6 11 7.6 9.2 9.8 8.5C7.6 9.8 6.4 11.2 6.4 11.2C8.8 11.6 11.4 9.8 11.4 6.2C11.4 5.7 11.2 5.2 11.2 5.2Z" fill="#6DB33F"/>
  `),

  // Maven (JetBrains 'm' icon)
  _maven: fileBadgeSvg('#25324D', '#3574F0', `
    <path d="M4.2 10.5V5.5L6.8 8.8L9.4 5.5V10.5M9.4 5.5H11.8" stroke="#56A8F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `),

  // Gradle
  _gradle: fileBadgeSvg('#1F383B', '#2AACB8', `
    <path d="M5 9.5C5 7.5 6.5 6 8.5 6H11V9.5C11 10.6 10.1 11.5 9 11.5H7C5.9 11.5 5 10.6 5 9.5Z" stroke="#42C6D2" stroke-width="1.3"/>
    <circle cx="9.2" cy="7.8" r="0.8" fill="#42C6D2"/>
  `),

  // Kotlin
  _kotlin: fileBadgeSvg('#2D253E', '#C77DBB', `
    <path d="M4.5 4.5H11.5L8 8L11.5 11.5H4.5V4.5Z" fill="#C77DBB"/>
  `),

  // TypeScript (.ts)
  _ts: fileBadgeSvg('#25324D', '#3574F0', `
    <path d="M4.2 5.5H8.2M6.2 5.5V11M11.8 6.2C11.2 5.6 9.5 5.5 9.5 6.8C9.5 8.5 12 8 12 9.8C12 11 10 11.2 9.2 10.4" stroke="#56A8F5" stroke-width="1.4" stroke-linecap="round"/>
  `),

  // React TSX / JSX (.tsx, .jsx)
  _tsx: svgWrap(`
    <circle cx="8" cy="8" r="1.5" fill="#56A8F5"/>
    <ellipse cx="8" cy="8" rx="6.2" ry="2.4" stroke="#56A8F5" stroke-width="1"/>
    <ellipse cx="8" cy="8" rx="6.2" ry="2.4" transform="rotate(60 8 8)" stroke="#56A8F5" stroke-width="1"/>
    <ellipse cx="8" cy="8" rx="6.2" ry="2.4" transform="rotate(120 8 8)" stroke="#56A8F5" stroke-width="1"/>
  `),

  // JavaScript (.js, .mjs, .cjs)
  _js: fileBadgeSvg('#3D3526', '#E0A82E', `
    <path d="M6.8 5.5V9.8C6.8 10.6 6.2 11 5.4 11C4.8 11 4.4 10.7 4.2 10.3M11.6 6.2C11 5.6 9.3 5.5 9.3 6.8C9.3 8.5 11.8 8 11.8 9.8C11.8 11 9.8 11.2 9 10.4" stroke="#F2C55C" stroke-width="1.4" stroke-linecap="round"/>
  `),

  // JSON (.json)
  _json: fileBadgeSvg('#2B2D30', '#9DA0A8', `
    <path d="M6.2 4.8C5.2 4.8 5.2 5.8 5.2 6.8C5.2 7.5 4.4 8 4.4 8C4.4 8 5.2 8.5 5.2 9.2C5.2 10.2 5.2 11.2 6.2 11.2M9.8 4.8C10.8 4.8 10.8 5.8 10.8 6.8C10.8 7.5 11.6 8 11.6 8C11.6 8 10.8 8.5 10.8 9.2C10.8 10.2 10.8 11.2 9.8 11.2" stroke="#E0A82E" stroke-width="1.3" stroke-linecap="round"/>
  `),

  // YAML (.yml, .yaml)
  _yaml: fileBadgeSvg('#35293E', '#C77DBB', `
    <path d="M4.5 5L6.8 8V11M9.1 5L6.8 8M9.5 11H11.8M9.5 8H11.8" stroke="#C77DBB" stroke-width="1.4" stroke-linecap="round"/>
  `),

  // XML (.xml)
  _xml: fileBadgeSvg('#3F2E26', '#E08855', `
    <path d="M6 5.5L3.8 8L6 10.5M10 5.5L12.2 8L10 10.5M8.6 5L7.4 11" stroke="#E08855" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
  `),

  // SQL / Database (.sql)
  _sql: svgWrap(`
    <ellipse cx="8" cy="4" rx="5" ry="2" fill="#3D3526" stroke="#E0A82E" stroke-width="1.1"/>
    <path d="M3 4V12C3 13.1 5.2 14 8 14C10.8 14 13 13.1 13 12V4" fill="#3D3526" stroke="#E0A82E" stroke-width="1.1"/>
    <path d="M3 8C3 9.1 5.2 10 8 10C10.8 10 13 9.1 13 8" stroke="#E0A82E" stroke-width="1.1"/>
  `),

  // HTML (.html)
  _html: fileBadgeSvg('#3F2E26', '#E08855', `
    <path d="M4.5 5V11M8.5 5V11M4.5 8H8.5M11 5V11" stroke="#E08855" stroke-width="1.4" stroke-linecap="round"/>
  `),

  // CSS / SCSS (.css, .scss)
  _css: fileBadgeSvg('#25324D', '#56A8F5', `
    <path d="M6 4.5L5 11.5M10.5 4.5L9.5 11.5M4.2 6.8H11.8M4 9.5H11.5" stroke="#56A8F5" stroke-width="1.3" stroke-linecap="round"/>
  `),

  // Markdown (.md)
  _md: fileBadgeSvg('#25324D', '#56A8F5', `
    <path d="M3.8 10.5V5.5L6 8L8.2 5.5V10.5M11.2 5.5V10.5M9.6 8.8L11.2 10.5L12.8 8.8" stroke="#56A8F5" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
  `),

  // Git (.gitignore, .gitattributes)
  _git: circleBadgeSvg('#3F2E26', '#D1675A', `
    <circle cx="6" cy="6" r="1.2" fill="#D1675A"/>
    <circle cx="10" cy="6" r="1.2" fill="#D1675A"/>
    <circle cx="6" cy="10.5" r="1.2" fill="#D1675A"/>
    <path d="M6 7.2V9.3M6 7.5C6 7.5 10 7.5 10 6" stroke="#D1675A" stroke-width="1.2"/>
  `),

  // Docker (Dockerfile, docker-compose.yml)
  _docker: fileBadgeSvg('#1F383B', '#2AACB8', `
    <rect x="4.5" y="7" width="2" height="2" fill="#42C6D2"/>
    <rect x="7" y="7" width="2" height="2" fill="#42C6D2"/>
    <rect x="7" y="4.5" width="2" height="2" fill="#42C6D2"/>
    <path d="M3.5 9.5H12.5C12.2 11.5 10.5 12.2 8 12.2C5.5 12.2 3.8 11.2 3.5 9.5Z" fill="#2AACB8"/>
  `),

  // Shell / Terminal (.sh, .ps1, .bat, .cmd)
  _shell: fileBadgeSvg('#2B2D30', '#9DA0A8', `
    <path d="M4.5 6L7 8L4.5 10M8 10.5H11.5" stroke="#6AAB73" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
  `),

  // Properties / Env (.properties, .env)
  _properties: fileBadgeSvg('#253B2F', '#59A869', `
    <path d="M4.5 5.5H11.5M4.5 8H11.5M4.5 10.5H9" stroke="#6AAB73" stroke-width="1.4" stroke-linecap="round"/>
  `),

  // PDF / Docs (.pdf)
  _pdf: fileBadgeSvg('#402929', '#F75464', `
    <path d="M5 10.5V5.5H7.5C8.5 5.5 9 6 9 6.8C9 7.6 8.5 8.1 7.5 8.1H5M10.5 5.5V10.5" stroke="#F75464" stroke-width="1.3" stroke-linecap="round"/>
  `),

  // Archive / JAR (.jar, .zip, .war)
  _jar: fileBadgeSvg('#3D3526', '#E0A82E', `
    <path d="M8 3V13M6.5 5H9.5M6.5 7.5H9.5M6.5 10H9.5" stroke="#F2C55C" stroke-width="1.3" stroke-linecap="round"/>
  `),

  // Image (.png, .jpg, .svg, .ico)
  _image: fileBadgeSvg('#253B2F', '#59A869', `
    <circle cx="6" cy="6" r="1.2" fill="#6AAB73"/>
    <path d="M3.5 11.5L6.5 8.5L8.5 10.5L10.5 8L12.5 11.5" stroke="#6AAB73" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
  `)
};

const iconDefinitions = {};
for (const [id, content] of Object.entries(SVGS)) {
  const filename = `${id.replace(/^_/, '')}.svg`;
  fs.writeFileSync(path.join(SVG_DIR, filename), content.trim(), 'utf8');
  iconDefinitions[id] = { iconPath: `./svgs/${filename}` };
}

// Scan workspace Java files to classify exact Java type (interface, enum, record, abstract class, annotation, exception, test, class)
const fileNames = {
  'pom.xml': '_maven',
  'mvnw': '_maven',
  'mvnw.cmd': '_maven',
  'build.gradle': '_gradle',
  'build.gradle.kts': '_gradle',
  'settings.gradle': '_gradle',
  'settings.gradle.kts': '_gradle',
  'gradlew': '_gradle',
  'gradlew.bat': '_gradle',
  'application.yml': '_spring',
  'application.yaml': '_spring',
  'application-dev.yml': '_spring',
  'application-local.yml': '_spring',
  'application-prod.yml': '_spring',
  'application-sit.yml': '_spring',
  'application-uat.yml': '_spring',
  'application.properties': '_spring',
  'application-dev.properties': '_spring',
  'application-local.properties': '_spring',
  'application-prod.properties': '_spring',
  'bootstrap.yml': '_spring',
  'bootstrap.properties': '_spring',
  'dockerfile': '_docker',
  'docker-compose.yml': '_docker',
  'docker-compose.yaml': '_docker',
  '.gitignore': '_git',
  '.gitattributes': '_git',
  '.gitmodules': '_git',
  '.env': '_properties',
  '.env.local': '_properties',
  '.env.development': '_properties',
  '.env.production': '_properties',
  'package.json': '_json',
  'tsconfig.json': '_ts',
  'next.config.js': '_js',
  'next.config.mjs': '_js',
  'next.config.ts': '_ts',
  'tailwind.config.js': '_css',
  'tailwind.config.ts': '_css'
};

function classifyJavaFile(filePath, baseName) {
  const lower = baseName.toLowerCase();
  if (lower.endsWith('test.java') || lower.endsWith('tests.java') || lower.endsWith('it.java')) {
    return '_java_test';
  }
  if (lower.endsWith('exception.java') || lower.endsWith('error.java')) {
    return '_java_exception';
  }
  try {
    const src = fs.readFileSync(filePath, 'utf8');
    // Strip block & line comments quickly so we match actual declaration
    const cleaned = src.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    if (/(?:^|\s)@interface\s+\w+/.test(cleaned)) return '_java_annotation';
    if (/\binterface\s+\w+/.test(cleaned)) return '_java_interface';
    if (/\benum\s+\w+/.test(cleaned)) return '_java_enum';
    if (/\brecord\s+\w+/.test(cleaned)) return '_java_record';
    if (/\babstract\s+class\s+\w+/.test(cleaned)) return '_java_abstract';
  } catch {
    // Fallback to naming conventions
  }
  if (lower.endsWith('service.java') || lower.endsWith('repository.java') || lower.endsWith('mapper.java') || lower.endsWith('client.java') || lower.endsWith('dao.java')) {
    return '_java_interface';
  }
  if (lower.endsWith('enum.java') || lower.endsWith('status.java')) {
    return '_java_enum';
  }
  if (lower.endsWith('dto.java') || lower.endsWith('request.java') || lower.endsWith('response.java') || lower.endsWith('record.java')) {
    return '_java_record';
  }
  if (lower.startsWith('abstract') || lower.startsWith('base')) {
    return '_java_abstract';
  }
  return '_java_class';
}

function walkWorkspaceJava(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (['node_modules', '.git', 'target', 'build', 'dist', '.next'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkWorkspaceJava(full);
    } else if (entry.isFile() && entry.name.endsWith('.java')) {
      fileNames[entry.name.toLowerCase()] = classifyJavaFile(full, entry.name);
    }
  }
}

walkWorkspaceJava('C:/Elaand-Enao/lendingfo');

const fileIconTheme = {
  iconDefinitions,
  file: '_file',
  folder: '_folder',
  folderExpanded: '_folder_open',
  folderNames: {
    'java': '_folder_java',
    'kotlin': '_folder_java',
    'test': '_folder_test',
    'tests': '_folder_test',
    '__tests__': '_folder_test',
    'resources': '_folder_resources',
    'assets': '_folder_resources',
    'public': '_folder_resources',
    'static': '_folder_resources',
    'i18n': '_folder_resources',
    'target': '_folder_excluded',
    'build': '_folder_excluded',
    'out': '_folder_excluded',
    'dist': '_folder_excluded',
    '.next': '_folder_excluded',
    'node_modules': '_folder_excluded',
    '.idea': '_folder_config',
    '.vscode': '_folder_config',
    '.github': '_folder_config',
    '.agents': '_folder_config'
  },
  folderNamesExpanded: {
    'java': '_folder_java_open',
    'kotlin': '_folder_java_open',
    'test': '_folder_test_open',
    'tests': '_folder_test_open',
    '__tests__': '_folder_test_open',
    'resources': '_folder_resources_open',
    'assets': '_folder_resources_open',
    'public': '_folder_resources_open',
    'static': '_folder_resources_open',
    'i18n': '_folder_resources_open',
    'target': '_folder_excluded_open',
    'build': '_folder_excluded_open',
    'out': '_folder_excluded_open',
    'dist': '_folder_excluded_open',
    '.next': '_folder_excluded_open',
    'node_modules': '_folder_excluded_open',
    '.idea': '_folder_config_open',
    '.vscode': '_folder_config_open',
    '.github': '_folder_config_open',
    '.agents': '_folder_config_open'
  },
  fileExtensions: {
    'java': '_java_class',
    'class': '_java_class',
    'kt': '_kotlin',
    'kts': '_kotlin',
    'ts': '_ts',
    'd.ts': '_ts',
    'tsx': '_tsx',
    'jsx': '_tsx',
    'js': '_js',
    'mjs': '_js',
    'cjs': '_js',
    'json': '_json',
    'jsonc': '_json',
    'yml': '_yaml',
    'yaml': '_yaml',
    'xml': '_xml',
    'xsd': '_xml',
    'wsdl': '_xml',
    'sql': '_sql',
    'html': '_html',
    'htm': '_html',
    'css': '_css',
    'scss': '_css',
    'less': '_css',
    'md': '_md',
    'mdx': '_md',
    'sh': '_shell',
    'bash': '_shell',
    'ps1': '_shell',
    'bat': '_shell',
    'cmd': '_shell',
    'properties': '_properties',
    'ini': '_properties',
    'conf': '_properties',
    'pdf': '_pdf',
    'jar': '_jar',
    'war': '_jar',
    'zip': '_jar',
    'png': '_image',
    'jpg': '_image',
    'jpeg': '_image',
    'gif': '_image',
    'svg': '_image',
    'ico': '_image',
    'webp': '_image'
  },
  fileNames,
  languageIds: {
    'java': '_java_class',
    'kotlin': '_kotlin',
    'typescript': '_ts',
    'typescriptreact': '_tsx',
    'javascript': '_js',
    'javascriptreact': '_tsx',
    'json': '_json',
    'jsonc': '_json',
    'yaml': '_yaml',
    'xml': '_xml',
    'sql': '_sql',
    'html': '_html',
    'css': '_css',
    'scss': '_css',
    'markdown': '_md',
    'shellscript': '_shell',
    'powershell': '_shell',
    'bat': '_shell',
    'properties': '_properties',
    'dockerfile': '_docker'
  }
};

fs.writeFileSync(JSON_PATH, JSON.stringify(fileIconTheme, null, 2), 'utf8');
console.log(`Generated ${Object.keys(SVGS).length} expui SVGs and mapped ${Object.keys(fileNames).length} specific files in ${JSON_PATH}`);

