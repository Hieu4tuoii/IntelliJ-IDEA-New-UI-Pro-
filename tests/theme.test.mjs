import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const THEME_PATH = path.join(ROOT, 'jetbrains-intellij-new-ui-pro/themes/intellij-new-ui-dark-pro.json');
const LIGHT_THEME_PATH = path.join(ROOT, 'jetbrains-intellij-new-ui-pro/themes/intellij-new-ui-light-pro.json');

test('Color theme matches exact JetBrains New UI Dark palette and Java/TS semantic tokens', () => {
  const theme = JSON.parse(fs.readFileSync(THEME_PATH, 'utf8'));
  assert.equal(theme.type, 'dark');
  assert.equal(theme.semanticHighlighting, true);

  // Core surfaces
  assert.equal(theme.colors['editor.background'].toUpperCase(), '#1E1F22');
  assert.equal(theme.colors['sideBar.background'].toUpperCase(), '#2B2D30');
  assert.equal(theme.colors['activityBar.background'].toUpperCase(), '#2B2D30');
  assert.equal(theme.colors['statusBar.background'].toUpperCase(), '#2B2D30');
  assert.equal(theme.colors['terminal.background'].toUpperCase(), '#1E1F22');
  assert.equal(theme.colors['focusBorder'].toUpperCase(), '#3574F0');
  assert.equal(theme.colors['list.activeSelectionBackground'].toUpperCase(), '#2E436E');
  assert.equal(theme.colors['editor.selectionBackground'].toUpperCase(), '#214283');
  assert.equal(theme.colors['editor.lineHighlightBackground'].toUpperCase(), '#26282E');
  assert.equal(theme.colors['editorInfo.foreground'].toUpperCase(), '#627858B3');
  assert.ok(Object.keys(theme.colors).length >= 320, `Must cover >= 320 workbench color keys, got ${Object.keys(theme.colors).length}`);

  // Semantic tokens for Java/Spring & TS
  const sem = theme.semanticTokenColors;
  assert.equal(sem['annotation'].foreground.toUpperCase(), '#B3AE60');
  assert.equal(sem['decorator'].foreground.toUpperCase(), '#B3AE60');
  assert.equal(sem['method.declaration'].foreground.toUpperCase(), '#56A8F5');
  assert.equal(sem['function.declaration'].foreground.toUpperCase(), '#56A8F5');
  assert.equal(sem['property'].foreground.toUpperCase(), '#C77DBB');
  assert.equal(sem['property'].fontStyle, '');
  assert.equal(sem['property.readonly'].foreground.toUpperCase(), '#C77DBB');
  assert.equal(sem['property.readonly'].fontStyle, '');
  assert.equal(sem['property.static'].foreground.toUpperCase(), '#C77DBB');
  assert.equal(sem['property.static'].fontStyle, '');
  assert.equal(sem['property.readonly.static'].foreground.toUpperCase(), '#C77DBB');
  assert.equal(sem['property.readonly.static'].fontStyle, 'italic');
  assert.equal(sem['enumMember'].foreground.toUpperCase(), '#C77DBB');
  assert.equal(sem['enumMember'].fontStyle, 'italic');
  assert.equal(sem['typeParameter'].foreground.toUpperCase(), '#16BAAC');
  assert.equal(sem['method.static'].foreground.toUpperCase(), '#57AAF7');
  assert.equal(sem['method.static'].fontStyle, 'italic');
  assert.equal(sem['operator'].foreground.toUpperCase(), '#BCBEC4');
  assert.equal(sem['*.constructor'].foreground.toUpperCase(), '#BCBEC4');
  assert.equal(sem['*.declaration.constructor'].foreground.toUpperCase(), '#56A8F5');
  assert.equal(sem['variable.modification'].foreground.toUpperCase(), '#BCBEC4');
  assert.equal(sem['variable.modification'].fontStyle, 'underline');
  assert.equal(sem['parameter.modification'].foreground.toUpperCase(), '#BCBEC4');
  assert.equal(sem['parameter.modification'].fontStyle, 'underline');
  assert.equal(sem['*.importDeclaration'].foreground.toUpperCase(), '#BCBEC4');
  assert.equal(sem['annotation.importDeclaration'].foreground.toUpperCase(), '#BCBEC4');
  assert.equal(sem['recordComponent'].foreground.toUpperCase(), '#C77DBB');
  assert.equal(sem['keyword.documentation'].foreground.toUpperCase(), '#67A37C');

  // Bracket highlights must all be flat #BCBEC4 (no rainbow brackets in IntelliJ New UI Dark)
  for (let i = 1; i <= 6; i++) {
    assert.equal(theme.colors[`editorBracketHighlight.foreground${i}`].toUpperCase(), '#BCBEC4');
  }
  assert.equal(theme.colors['list.errorForeground'].toUpperCase(), '#DFE1E5');
  assert.equal(theme.colors['list.warningForeground'].toUpperCase(), '#DFE1E5');

  // Diff & Gutter change colors: IntelliJ Gray (DIFF_DELETED #484A4A/#656E76) for removed + Blue (DIFF_MODIFIED #385570/#43698D) for inserted/modified
  assert.equal(theme.colors['diffEditor.insertedLineBackground'].toUpperCase(), '#38557066');
  assert.equal(theme.colors['diffEditor.removedLineBackground'].toUpperCase(), '#484A4A66');
  assert.equal(theme.colors['diffEditor.insertedTextBackground'].toUpperCase(), '#43698D99');
  assert.equal(theme.colors['diffEditor.removedTextBackground'].toUpperCase(), '#656E7699');
  assert.equal(theme.colors['diffEditor.diagonalFill'].toUpperCase(), '#00000000');
  assert.equal(theme.colors['editorGutter.modifiedBackground'].toUpperCase(), '#375FAD');
  assert.equal(theme.colors['editorGutter.addedBackground'].toUpperCase(), '#549159');

  // TextMate tokenColors verification for operators (=, ==, !=, +, :, |), semicolons (;), commas (,), and method calls
  const keywordRule = theme.tokenColors.find(r => r.name.includes('Keywords'));
  assert.ok(keywordRule, 'Must have Keywords rule');
  assert.ok(!keywordRule.scope.includes('punctuation.terminator.java'), 'Semicolon must not be orange in New UI Dark');
  assert.ok(!keywordRule.scope.includes('punctuation.separator.delimiter'), 'Comma must not be orange in New UI Dark');

  const operatorRule = theme.tokenColors.find(r => r.name.includes('Operators'));
  assert.ok(operatorRule, 'Must have dedicated Operators & Punctuation rule');
  assert.equal(operatorRule.settings.foreground.toUpperCase(), '#BCBEC4');
  assert.ok(operatorRule.scope.includes('keyword.operator'));
  assert.ok(operatorRule.scope.includes('keyword.operator.assignment'));
  assert.ok(operatorRule.scope.includes('keyword.control.ternary'));
  assert.ok(operatorRule.scope.includes('punctuation.terminator.java'));
  assert.ok(operatorRule.scope.includes('punctuation.separator.delimiter'));

  const callRule = theme.tokenColors.find(r => r.name.includes('Function Calls'));
  assert.ok(callRule, 'Must have Function Calls rule');
  assert.equal(callRule.settings.foreground.toUpperCase(), '#BCBEC4');

  const typeRule = theme.tokenColors.find(r => r.name.includes('Classes, Interfaces, Types'));
  assert.ok(typeRule, 'Must have Classes, Interfaces, Types & Parameters rule');
  assert.ok(typeRule.scope.includes('storage.type.import.java'), 'Java imports must be #BCBEC4 in TextMate to prevent orange-to-gray text flicker');
  assert.ok(typeRule.scope.includes('storage.type.package.java'), 'Java packages must be #BCBEC4 in TextMate to prevent orange-to-gray text flicker');
});


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
  assert.ok(Object.keys(theme.colors).length >= 320, `Must cover >= 320 workbench color keys, got ${Object.keys(theme.colors).length}`);

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
  assert.equal(sem['comment.documentation'].foreground.toUpperCase(), '#8C8C8C');
  assert.equal(theme.colors['editorBracketMatch.background'].toUpperCase(), '#93D9D9');
  assert.equal(theme.colors['editor.wordHighlightBackground'].toUpperCase(), '#EDEBFC');
  assert.equal(theme.colors['editor.wordHighlightStrongBackground'].toUpperCase(), '#FCE8F4');
  assert.equal(sem['operator'].foreground.toUpperCase(), '#080808');
  assert.equal(sem['*.importDeclaration'].foreground.toUpperCase(), '#080808');

  // Anti-flicker TextMate alignment for Java imports/packages
  const typeRule = theme.tokenColors.find(r => r.name.includes('Classes, Interfaces, Types'));
  assert.ok(typeRule, 'Must have Classes, Interfaces, Types & Parameters rule');
  assert.ok(typeRule.scope.includes('storage.type.import.java'));
  assert.ok(typeRule.scope.includes('storage.type.package.java'));
  assert.equal(typeRule.settings.foreground.toUpperCase(), '#080808');
});
