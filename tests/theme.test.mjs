import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const THEME_PATH = path.join(ROOT, 'jetbrains-intellij-new-ui-dark/themes/intellij-new-ui-dark-pro.json');

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
  assert.equal(sem['typeParameter'].foreground.toUpperCase(), '#507874');
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

  // Diff & Gutter change colors matching IntelliJ screenshot (#2B425780 = dark slate blue #25313D, #2B4B34BF = green #294436, #54534FBF = gray #484A4A)
  assert.equal(theme.colors['diffEditor.insertedLineBackground'].toUpperCase(), '#2B425780');
  assert.equal(theme.colors['diffEditor.removedLineBackground'].toUpperCase(), '#2B425780');
  assert.equal(theme.colors['diffEditor.insertedTextBackground'].toUpperCase(), '#2B4B34BF');
  assert.equal(theme.colors['diffEditor.removedTextBackground'].toUpperCase(), '#54534FBF');
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
});

