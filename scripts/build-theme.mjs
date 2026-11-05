import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_PATH = path.join(ROOT, 'jetbrains-intellij-new-ui-pro/themes/intellij-new-ui-dark-pro.json');
const LIGHT_OUT_PATH = path.join(ROOT, 'jetbrains-intellij-new-ui-pro/themes/intellij-new-ui-light-pro.json');

const theme = {
  $schema: 'vscode://schemas/color-theme',
  name: 'IntelliJ IDEA New UI Dark (Pro)',
  type: 'dark',
  semanticHighlighting: true,
  colors: {
    // 1. Base & Contrast
    'focusBorder': '#3574F0',
    'foreground': '#DFE1E5',
    'disabledForeground': '#6F737A',
    'widget.border': '#43454A',
    'widget.shadow': '#00000066',
    'selection.background': '#214283',
    'descriptionForeground': '#9DA0A8',
    'errorForeground': '#F75464',
    'icon.foreground': '#CED0D6',
    'sash.hoverBorder': '#3574F0',

    // 2. Window & Title Bar (New UI Main Toolbar #2B2D30)
    'window.activeBorder': '#1E1F22',
    'window.inactiveBorder': '#1E1F22',
    'titleBar.activeBackground': '#2B2D30',
    'titleBar.activeForeground': '#DFE1E5',
    'titleBar.inactiveBackground': '#2B2D30',
    'titleBar.inactiveForeground': '#9DA0A8',
    'titleBar.border': '#1E1F22',

    // 3. Menubar & Menus
    'menubar.selectionForeground': '#DFE1E5',
    'menubar.selectionBackground': '#393B40',
    'menubar.selectionBorder': '#393B40',
    'menu.foreground': '#DFE1E5',
    'menu.background': '#2B2D30',
    'menu.selectionForeground': '#DFE1E5',
    'menu.selectionBackground': '#2E436E',
    'menu.selectionBorder': '#2E436E',
    'menu.separatorBackground': '#393B40',
    'menu.border': '#43454A',

    // 4. Command Center (Search Everywhere / Toolbar Pill)
    'commandCenter.foreground': '#DFE1E5',
    'commandCenter.activeForeground': '#FFFFFF',
    'commandCenter.background': '#1E1F22',
    'commandCenter.activeBackground': '#393B40',
    'commandCenter.border': '#393B40',
    'commandCenter.activeBorder': '#3574F0',
    'commandCenter.inactiveForeground': '#9DA0A8',
    'commandCenter.inactiveBorder': '#393B40',
    'commandCenter.debuggingBackground': '#2B2D30',

    // 5. Activity Bar (Tool Window Bar)
    'activityBar.background': '#2B2D30',
    'activityBar.dropBorder': '#3574F0',
    'activityBar.foreground': '#DFE1E5',
    'activityBar.inactiveForeground': '#9DA0A8',
    'activityBar.border': '#1E1F22',
    'activityBarBadge.background': '#3574F0',
    'activityBarBadge.foreground': '#FFFFFF',
    'activityBar.activeBorder': '#3574F0',
    'activityBar.activeBackground': '#393B40',
    'activityBar.activeFocusBorder': '#3574F0',
    'activityBarTop.foreground': '#DFE1E5',
    'activityBarTop.activeBorder': '#3574F0',
    'activityBarTop.inactiveForeground': '#9DA0A8',
    'activityBarTop.dropBorder': '#3574F0',
    'activityBarTop.background': '#2B2D30',
    'activityBarTop.activeBackground': '#393B40',

    // 6. Side Bar (Project Tool Window #2B2D30)
    'sideBar.background': '#2B2D30',
    'sideBar.foreground': '#DFE1E5',
    'sideBar.border': '#1E1F22',
    'sideBar.dropBackground': '#2E436E55',
    'sideBarTitle.foreground': '#DFE1E5',
    'sideBarTitle.background': '#2B2D30',
    'sideBarSectionHeader.background': '#2B2D30',
    'sideBarSectionHeader.foreground': '#DFE1E5',
    'sideBarSectionHeader.border': '#1E1F22',
    'sideBarActivityBarTop.border': '#1E1F22',
    'sideBarStickyScroll.background': '#2B2D30',
    'sideBarStickyScroll.border': '#393B40',

    // 7. Lists & Trees (Project Explorer & Tool Window Trees)
    'list.activeSelectionBackground': '#2E436E',
    'list.activeSelectionForeground': '#DFE1E5',
    'list.activeSelectionIconForeground': '#DFE1E5',
    'list.dropBackground': '#2E436E80',
    'list.focusBackground': '#2E436E',
    'list.focusForeground': '#DFE1E5',
    'list.focusHighlightForeground': '#F2C55C',
    'list.focusOutline': '#3574F0',
    'list.focusAndSelectionOutline': '#2E436E',
    'list.highlightForeground': '#F2C55C',
    'list.hoverBackground': '#393B4080',
    'list.hoverForeground': '#DFE1E5',
    'list.inactiveSelectionBackground': '#43454A',
    'list.inactiveSelectionForeground': '#DFE1E5',
    'list.inactiveSelectionIconForeground': '#DFE1E5',
    'list.inactiveFocusBackground': '#43454A',
    'list.inactiveFocusOutline': '#43454A',
    'list.invalidItemForeground': '#F75464',
    'list.errorForeground': '#DFE1E5',
    'list.warningForeground': '#DFE1E5',
    'listFilterWidget.background': '#1E1F22',
    'listFilterWidget.outline': '#3574F0',
    'listFilterWidget.noMatchesOutline': '#F75464',
    'listFilterWidget.shadow': '#00000066',
    'list.filterMatchBackground': '#2D543F',
    'list.filterMatchBorder': '#42BD77',
    'list.deemphasizedForeground': '#7A7E85',
    'tree.indentGuidesStroke': '#393B40',
    'tree.inactiveIndentGuidesStroke': '#313438',
    'tree.tableColumnsBorder': '#393B40',
    'tree.tableOddRowsBackground': '#26282E',

    // 8. Buttons, Badges, Checkboxes, Dropdowns, Inputs
    'button.background': '#3574F0',
    'button.foreground': '#FFFFFF',
    'button.border': '#3574F0',
    'button.separator': '#FFFFFF33',
    'button.hoverBackground': '#538AF6',
    'button.secondaryForeground': '#DFE1E5',
    'button.secondaryBackground': '#393B40',
    'button.secondaryHoverBackground': '#43454A',
    'checkbox.background': '#1E1F22',
    'checkbox.foreground': '#DFE1E5',
    'checkbox.border': '#4E5157',
    'checkbox.selectBackground': '#3574F0',
    'checkbox.selectBorder': '#3574F0',
    'dropdown.background': '#2B2D30',
    'dropdown.listBackground': '#2B2D30',
    'dropdown.border': '#4E5157',
    'dropdown.foreground': '#DFE1E5',
    'input.background': '#1E1F22',
    'input.border': '#4E5157',
    'input.foreground': '#DFE1E5',
    'input.placeholderForeground': '#6F737A',
    'inputOption.activeBackground': '#3574F04D',
    'inputOption.activeBorder': '#3574F0',
    'inputOption.activeForeground': '#DFE1E5',
    'inputOption.hoverBackground': '#393B40',
    'inputValidation.errorBackground': '#402929',
    'inputValidation.errorForeground': '#F75464',
    'inputValidation.errorBorder': '#DB5C5C',
    'inputValidation.infoBackground': '#25324D',
    'inputValidation.infoForeground': '#DFE1E5',
    'inputValidation.infoBorder': '#3574F0',
    'inputValidation.warningBackground': '#453C27',
    'inputValidation.warningForeground': '#F2C55C',
    'inputValidation.warningBorder': '#C29E49',
    'badge.foreground': '#DFE1E5',
    'badge.background': '#393B40',
    'progressBar.background': '#3574F0',

    // 9. Scrollbar & Minimap
    'scrollbar.shadow': '#00000040',
    'scrollbarSlider.activeBackground': '#6F737AA6',
    'scrollbarSlider.background': '#4E515780',
    'scrollbarSlider.hoverBackground': '#6F737A99',
    'minimap.findMatchHighlight': '#42BD7799',
    'minimap.selectionHighlight': '#214283CC',
    'minimap.errorHighlight': '#F75464',
    'minimap.warningHighlight': '#F2C55C',
    'minimap.background': '#1E1F22',
    'minimap.selectionOccurrenceHighlight': '#404E45CC',
    'minimapSlider.background': '#3F404366',
    'minimapSlider.hoverBackground': '#53545580',
    'minimapSlider.activeBackground': '#6F737A99',
    'minimapGutter.addedBackground': '#549159',
    'minimapGutter.modifiedBackground': '#375FAD',
    'minimapGutter.deletedBackground': '#868A91',

    // 10. Editor Groups & Tabs (New UI Editor Tabs #1E1F22 with 3px #3574F0 underline)
    'editorGroup.border': '#393B40',
    'editorGroup.dropBackground': '#2E436E4D',
    'editorGroupHeader.noTabsBackground': '#1E1F22',
    'editorGroupHeader.tabsBackground': '#1E1F22',
    'editorGroupHeader.tabsBorder': '#2B2D30',
    'editorGroupHeader.border': '#2B2D30',
    'editorGroup.emptyBackground': '#1E1F22',
    'editorGroup.focusedEmptyBorder': '#3574F0',
    'tab.activeBackground': '#1E1F22',
    'tab.unfocusedActiveBackground': '#1E1F22',
    'tab.activeForeground': '#DFE1E5',
    'tab.border': '#1E1F22',
    'tab.activeBorder': '#3574F0',
    'tab.selectedBackground': '#26282E',
    'tab.selectedForeground': '#DFE1E5',
    'tab.unfocusedActiveBorder': '#6F737A',
    'tab.activeBorderTop': '#00000000',
    'tab.unfocusedActiveBorderTop': '#00000000',
    'tab.lastPinnedBorder': '#393B40',
    'tab.inactiveBackground': '#1E1F22',
    'tab.unfocusedInactiveBackground': '#1E1F22',
    'tab.inactiveForeground': '#9DA0A8',
    'tab.unfocusedActiveForeground': '#9DA0A8',
    'tab.unfocusedInactiveForeground': '#6F737A',
    'tab.hoverBackground': '#26282E',
    'tab.unfocusedHoverBackground': '#26282E',
    'tab.hoverForeground': '#DFE1E5',
    'tab.unfocusedHoverForeground': '#DFE1E5',
    'tab.activeModifiedBorder': '#6897BB',
    'tab.inactiveModifiedBorder': '#6897BB80',
    'tab.unfocusedActiveModifiedBorder': '#6897BB80',
    'tab.unfocusedInactiveModifiedBorder': '#6897BB4D',
    'editorPane.background': '#1E1F22',

    // 11. Code Editor Canvas, Gutter, Selection & Highlights
    'editor.background': '#1E1F22',
    'editor.foreground': '#BCBEC4',
    'editorLineNumber.foreground': '#4B5059',
    'editorLineNumber.activeForeground': '#A1A3AB',
    'editorLineNumber.dimmedForeground': '#393B40',
    'editorCursor.background': '#1E1F22',
    'editorCursor.foreground': '#CED0D6',
    'editor.selectionBackground': '#214283',
    'editor.selectionForeground': '#BCBEC4',
    'editor.inactiveSelectionBackground': '#21428380',
    'editor.selectionHighlightBackground': '#2D543F66',
    'editor.selectionHighlightBorder': '#42BD7766',
    'editor.wordHighlightBackground': '#373B39CC',
    'editor.wordHighlightBorder': '#4E5853',
    'editor.wordHighlightStrongBackground': '#57343ECC',
    'editor.wordHighlightStrongBorder': '#7A4654',
    'editor.wordHighlightTextBackground': '#373B3999',
    'editor.findMatchBackground': '#114957',
    'editor.findMatchBorder': '#165E70',
    'editor.findMatchHighlightBackground': '#32593D80',
    'editor.findMatchHighlightBorder': '#3C704B',
    'editor.findRangeHighlightBackground': '#2142834D',
    'editor.hoverHighlightBackground': '#2E436E66',
    'editor.lineHighlightBackground': '#26282E',
    'editor.lineHighlightBorder': '#26282E',
    'editorUnicodeHighlight.border': '#F2C55C',
    'editorUnicodeHighlight.background': '#453C2766',
    'editorLink.activeForeground': '#56A8F5',
    'editor.rangeHighlightBackground': '#26282E99',
    'editor.symbolHighlightBackground': '#2D543F80',
    'editorWhitespace.foreground': '#393B40',
    'editorIndentGuide.background1': '#313438',
    'editorIndentGuide.activeBackground1': '#4E5157',
    'editorIndentGuide.background2': '#313438',
    'editorIndentGuide.activeBackground2': '#4E5157',
    'editorInlayHint.background': '#393B40CC',
    'editorInlayHint.foreground': '#868A91',
    'editorInlayHint.typeBackground': '#393B40CC',
    'editorInlayHint.typeForeground': '#868A91',
    'editorInlayHint.parameterBackground': '#393B40CC',
    'editorInlayHint.parameterForeground': '#868A91',
    'editorRuler.foreground': '#313438',
    'editor.linkedEditingBackground': '#2E436E66',
    'editorCodeLens.foreground': '#7A7E85',
    'editorLightBulb.foreground': '#F2C55C',
    'editorLightBulbAutoFix.foreground': '#F75464',
    'editorLightBulbAi.foreground': '#56A8F5',
    'editorBracketMatch.background': '#43454A',
    'editorBracketMatch.border': '#5A5D63',
    'editorBracketHighlight.foreground1': '#BCBEC4',
    'editorBracketHighlight.foreground2': '#BCBEC4',
    'editorBracketHighlight.foreground3': '#BCBEC4',
    'editorBracketHighlight.foreground4': '#BCBEC4',
    'editorBracketHighlight.foreground5': '#BCBEC4',
    'editorBracketHighlight.foreground6': '#BCBEC4',
    'editorBracketHighlight.unexpectedBracket.foreground': '#F75464',
    'editorBracketPairGuide.activeBackground1': '#4E5157',
    'editorBracketPairGuide.background1': '#313438',
    'editor.foldBackground': '#2B2D3099',
    'editor.foldPlaceholderForeground': '#7A7E85',
    'editorGutter.background': '#1E1F22',
    'editorGutter.modifiedBackground': '#375FAD',
    'editorGutter.addedBackground': '#549159',
    'editorGutter.deletedBackground': '#868A91',
    'editorGutter.commentRangeForeground': '#4E5157',
    'editorGutter.foldingControlForeground': '#6F737A',
    'editorUnnecessaryCode.opacity': '#00000077',
    'editorGhostText.foreground': '#6F737A',

    // 12. Sticky Scroll & Breadcrumbs
    'editorStickyScroll.background': '#1E1F22',
    'editorStickyScrollHover.background': '#26282E',
    'editorStickyScroll.border': '#313438',
    'editorStickyScroll.shadow': '#00000066',
    'breadcrumb.foreground': '#9DA0A8',
    'breadcrumb.background': '#1E1F22',
    'breadcrumb.focusForeground': '#DFE1E5',
    'breadcrumb.activeSelectionForeground': '#DFE1E5',
    'breadcrumbPicker.background': '#2B2D30',

    // 13. Editor Overview Ruler, Errors, Warnings & Widgets
    'editorError.foreground': '#F75464',
    'editorError.border': '#00000000',
    'editorWarning.foreground': '#F2C55C',
    'editorWarning.border': '#00000000',
    'editorInfo.foreground': '#627858B3',
    'editorHint.foreground': '#857042',
    'problemsErrorIcon.foreground': '#F75464',
    'problemsWarningIcon.foreground': '#F2C55C',
    'problemsInfoIcon.foreground': '#56A8F5',
    'editorOverviewRuler.border': '#1E1F22',
    'editorOverviewRuler.findMatchForeground': '#72D6D6B3',
    'editorOverviewRuler.rangeHighlightForeground': '#3574F080',
    'editorOverviewRuler.selectionHighlightForeground': '#678D7BCC',
    'editorOverviewRuler.wordHighlightForeground': '#678D7BCC',
    'editorOverviewRuler.wordHighlightStrongForeground': '#E977A6CC',
    'editorOverviewRuler.modifiedForeground': '#375FAD',
    'editorOverviewRuler.addedForeground': '#549159',
    'editorOverviewRuler.deletedForeground': '#868A91',
    'editorOverviewRuler.errorForeground': '#F75464',
    'editorOverviewRuler.warningForeground': '#F2C55C',
    'editorOverviewRuler.infoForeground': '#56A8F5',
    'editorOverviewRuler.bracketMatchForeground': '#6F737A',
    'editorWidget.foreground': '#DFE1E5',
    'editorWidget.background': '#2B2D30',
    'editorWidget.border': '#43454A',
    'editorWidget.resizeBorder': '#3574F0',
    'editorSuggestWidget.background': '#2B2D30',
    'editorSuggestWidget.border': '#43454A',
    'editorSuggestWidget.foreground': '#DFE1E5',
    'editorSuggestWidget.focusHighlightForeground': '#56A8F5',
    'editorSuggestWidget.highlightForeground': '#56A8F5',
    'editorSuggestWidget.selectedBackground': '#2E436E',
    'editorSuggestWidget.selectedForeground': '#DFE1E5',
    'editorSuggestWidget.selectedIconForeground': '#DFE1E5',
    'editorHoverWidget.foreground': '#DFE1E5',
    'editorHoverWidget.background': '#2B2D30',
    'editorHoverWidget.border': '#43454A',
    'editorHoverWidget.highlightForeground': '#56A8F5',
    'editorHoverWidget.statusBarBackground': '#393B40',

    // 14. Diff & Merge Editor (IntelliJ 3-color palette: Blue #2B425780 + Gray #656E7699 for old/removed block, Green #29443699 + #447152CC for new/inserted block)
    'diffEditor.insertedLineBackground': '#29443699',
    'diffEditor.removedLineBackground': '#2B425780',
    'diffEditor.insertedTextBackground': '#447152CC',
    'diffEditor.removedTextBackground': '#656E7699',
    'diffEditorGutter.insertedLineBackground': '#29443699',
    'diffEditorGutter.removedLineBackground': '#25313D',
    'diffEditorOverview.insertedForeground': '#549159',
    'diffEditorOverview.removedForeground': '#656E76',
    'diffEditor.diagonalFill': '#00000000',
    'diffEditor.border': '#393B40',
    'merge.currentHeaderBackground': '#294436CC',
    'merge.currentContentBackground': '#29443666',
    'merge.incomingHeaderBackground': '#25313DCC',
    'merge.incomingContentBackground': '#2B425780',
    'merge.border': '#393B40',
    'editorOverviewRuler.currentContentForeground': '#549159',
    'editorOverviewRuler.incomingContentForeground': '#375FAD',
    'mergeEditor.change.background': '#29443699',
    'mergeEditor.change.word.background': '#447152CC',
    'mergeEditor.changeBase.background': '#2B425780',
    'mergeEditor.changeBase.word.background': '#656E7699',

    // 15. Peek View & Quick Input (Search Everywhere / Go to Class Popup)
    'peekView.border': '#43454A',
    'peekViewEditor.background': '#1E1F22',
    'peekViewEditorGutter.background': '#1E1F22',
    'peekViewEditor.matchHighlightBackground': '#2D543F',
    'peekViewEditor.matchHighlightBorder': '#42BD77',
    'peekViewResult.background': '#2B2D30',
    'peekViewResult.fileForeground': '#DFE1E5',
    'peekViewResult.lineForeground': '#BCBEC4',
    'peekViewResult.matchHighlightBackground': '#2D543F',
    'peekViewResult.selectionBackground': '#2E436E',
    'peekViewResult.selectionForeground': '#DFE1E5',
    'peekViewTitle.background': '#393B40',
    'peekViewTitleDescription.foreground': '#9DA0A8',
    'peekViewTitleLabel.foreground': '#DFE1E5',
    'pickerGroup.border': '#393B40',
    'pickerGroup.foreground': '#56A8F5',
    'quickInput.background': '#2B2D30',
    'quickInput.foreground': '#DFE1E5',
    'quickInputTitle.background': '#393B40',
    'quickInputList.focusBackground': '#2E436E',
    'quickInputList.focusForeground': '#DFE1E5',
    'quickInputList.focusIconForeground': '#DFE1E5',

    // 16. Panels & JetBrains JediTerm Terminal (16 ANSI Colors)
    'panel.background': '#2B2D30',
    'panel.border': '#1E1F22',
    'panel.dropBorder': '#3574F0',
    'panelTitle.activeBorder': '#3574F0',
    'panelTitle.activeForeground': '#DFE1E5',
    'panelTitle.inactiveForeground': '#9DA0A8',
    'panelInput.border': '#4E5157',
    'panelSection.border': '#393B40',
    'panelSection.dropBackground': '#2E436E55',
    'panelSectionHeader.background': '#2B2D30',
    'panelSectionHeader.foreground': '#DFE1E5',
    'panelSectionHeader.border': '#393B40',
    'terminal.background': '#1E1F22',
    'terminal.foreground': '#BCBEC4',
    'terminal.border': '#2B2D30',
    'terminalCursor.background': '#1E1F22',
    'terminalCursor.foreground': '#CED0D6',
    'terminal.selectionBackground': '#214283',
    'terminal.inactiveSelectionBackground': '#21428380',
    'terminal.findMatchBackground': '#2D543F',
    'terminal.findMatchBorder': '#42BD77',
    'terminal.findMatchHighlightBackground': '#32593D80',
    'terminalCommandDecoration.defaultBackground': '#6F737A',
    'terminalCommandDecoration.successBackground': '#59A869',
    'terminalCommandDecoration.errorBackground': '#F75464',
    'terminal.ansiBlack': '#1E1F22',
    'terminal.ansiBrightBlack': '#6F737A',
    'terminal.ansiRed': '#F75464',
    'terminal.ansiBrightRed': '#FF6B7A',
    'terminal.ansiGreen': '#6AAB73',
    'terminal.ansiBrightGreen': '#73BD79',
    'terminal.ansiYellow': '#E0A82E',
    'terminal.ansiBrightYellow': '#F2C55C',
    'terminal.ansiBlue': '#56A8F5',
    'terminal.ansiBrightBlue': '#6A9BFA',
    'terminal.ansiMagenta': '#C77DBB',
    'terminal.ansiBrightMagenta': '#D688C9',
    'terminal.ansiCyan': '#2AACB8',
    'terminal.ansiBrightCyan': '#42C6D2',
    'terminal.ansiWhite': '#BCBEC4',
    'terminal.ansiBrightWhite': '#DFE1E5',

    // 17. Status Bar (JetBrains Bottom Bar #2B2D30)
    'statusBar.background': '#2B2D30',
    'statusBar.foreground': '#9DA0A8',
    'statusBar.border': '#1E1F22',
    'statusBar.debuggingBackground': '#2B2D30',
    'statusBar.debuggingForeground': '#DFE1E5',
    'statusBar.debuggingBorder': '#3574F0',
    'statusBar.noFolderForeground': '#9DA0A8',
    'statusBar.noFolderBackground': '#2B2D30',
    'statusBar.noFolderBorder': '#1E1F22',
    'statusBarItem.activeBackground': '#43454A',
    'statusBarItem.hoverForeground': '#DFE1E5',
    'statusBarItem.hoverBackground': '#393B40',
    'statusBarItem.prominentForeground': '#DFE1E5',
    'statusBarItem.prominentBackground': '#393B40',
    'statusBarItem.prominentHoverBackground': '#43454A',
    'statusBarItem.remoteBackground': '#3574F0',
    'statusBarItem.remoteForeground': '#FFFFFF',
    'statusBarItem.errorBackground': '#DB5C5C',
    'statusBarItem.errorForeground': '#FFFFFF',
    'statusBarItem.warningBackground': '#C29E49',
    'statusBarItem.warningForeground': '#FFFFFF',

    // 18. Antigravity Chat, Inline Chat, Debug, Git & Notifications
    'chat.requestBorder': '#393B40',
    'chat.requestBackground': '#1E1F22',
    'chat.slashCommandBackground': '#2E436E',
    'chat.slashCommandForeground': '#56A8F5',
    'chat.avatarBackground': '#3574F0',
    'chat.avatarForeground': '#FFFFFF',
    'inlineChat.background': '#2B2D30',
    'inlineChat.border': '#43454A',
    'inlineChat.shadow': '#00000066',
    'inlineChatInput.border': '#4E5157',
    'inlineChatInput.focusBorder': '#3574F0',
    'inlineChatInput.placeholderForeground': '#6F737A',
    'inlineChatInput.background': '#1E1F22',
    'inlineChatDiff.inserted': '#283541B3',
    'inlineChatDiff.removed': '#383A4080',
    'debugToolBar.background': '#2B2D30',
    'debugToolBar.border': '#43454A',
    'editor.focusedStackFrameHighlightBackground': '#25324D',
    'editor.stackFrameHighlightBackground': '#393B4080',
    'debugIcon.breakpointForeground': '#DB5C5C',
    'debugIcon.breakpointDisabledForeground': '#6F737A',
    'debugIcon.breakpointUnverifiedForeground': '#9DA0A8',
    'debugIcon.startForeground': '#59A869',
    'debugIcon.pauseForeground': '#F2C55C',
    'debugIcon.stopForeground': '#DB5C5C',
    'debugIcon.disconnectForeground': '#DB5C5C',
    'debugIcon.restartForeground': '#59A869',
    'debugIcon.stepOverForeground': '#56A8F5',
    'debugIcon.stepIntoForeground': '#56A8F5',
    'debugIcon.stepOutForeground': '#56A8F5',
    'debugIcon.continueForeground': '#59A869',
    'debugTokenExpression.name': '#C77DBB',
    'debugTokenExpression.value': '#BCBEC4',
    'debugTokenExpression.string': '#6AAB73',
    'debugTokenExpression.boolean': '#CF8E6D',
    'debugTokenExpression.number': '#2AACB8',
    'debugTokenExpression.error': '#F75464',
    'gitDecoration.addedResourceForeground': '#73BD79',
    'gitDecoration.modifiedResourceForeground': '#70AEFF',
    'gitDecoration.deletedResourceForeground': '#6F737A',
    'gitDecoration.renamedResourceForeground': '#70AEFF',
    'gitDecoration.stageModifiedResourceForeground': '#70AEFF',
    'gitDecoration.stageDeletedResourceForeground': '#6F737A',
    'gitDecoration.untrackedResourceForeground': '#E88F89',
    'gitDecoration.ignoredResourceForeground': '#D69A6B',
    'gitDecoration.conflictingResourceForeground': '#DE6A66',
    'gitDecoration.submoduleResourceForeground': '#70AEFF',
    'notificationCenter.border': '#43454A',
    'notificationCenterHeader.foreground': '#DFE1E5',
    'notificationCenterHeader.background': '#2B2D30',
    'notificationToast.border': '#43454A',
    'notifications.foreground': '#DFE1E5',
    'notifications.background': '#393B40',
    'notifications.border': '#43454A',
    'notificationLink.foreground': '#56A8F5',
    'notificationsErrorIcon.foreground': '#F75464',
    'notificationsWarningIcon.foreground': '#F2C55C',
    'notificationsInfoIcon.foreground': '#56A8F5',
    'textLink.foreground': '#56A8F5',
    'textLink.activeForeground': '#6A9BFA',
    'textPreformat.foreground': '#BCBEC4',
    'textPreformat.background': '#2B2D30',
    'textBlockQuote.background': '#2B2D30',
    'textBlockQuote.border': '#3574F0',
    'textCodeBlock.background': '#1E1F22',
    'keybindingLabel.background': '#393B40',
    'keybindingLabel.foreground': '#DFE1E5',
    'keybindingLabel.border': '#4E5157',
    'keybindingLabel.bottomBorder': '#4E5157',
    'settings.headerForeground': '#DFE1E5',
    'settings.modifiedItemIndicator': '#3574F0',
    'settings.dropdownBackground': '#2B2D30',
    'settings.dropdownForeground': '#DFE1E5',
    'settings.dropdownBorder': '#4E5157',
    'settings.checkboxBackground': '#3574F0',
    'settings.checkboxForeground': '#FFFFFF',
    'settings.checkboxBorder': '#3574F0',
    'settings.textInputBackground': '#1E1F22',
    'settings.textInputForeground': '#DFE1E5',
    'settings.textInputBorder': '#4E5157',
    'settings.numberInputBackground': '#1E1F22',
    'settings.numberInputForeground': '#DFE1E5',
    'settings.numberInputBorder': '#4E5157',
    'welcomePage.background': '#1E1F22',
    'welcomePage.tileBackground': '#2B2D30',
    'welcomePage.tileHoverBackground': '#393B40',
    'welcomePage.tileBorder': '#393B40',
    'symbolIcon.classForeground': '#548AF7',
    'symbolIcon.interfaceForeground': '#57965C',
    'symbolIcon.enumeratorForeground': '#C08DF2',
    'symbolIcon.methodForeground': '#E5A14B',
    'symbolIcon.functionForeground': '#E5A14B',
    'symbolIcon.constructorForeground': '#E5A14B',
    'symbolIcon.fieldForeground': '#CF8E6D',
    'symbolIcon.propertyForeground': '#C77DBB',
    'symbolIcon.packageForeground': '#9DA0A8',
    'symbolIcon.namespaceForeground': '#9DA0A8'
  },

  // Deep Semantic Highlighting (JetBrains dark.xml exact rules)
  semanticTokenColors: {
    'namespace': { foreground: '#BCBEC4' },
    'package': { foreground: '#BCBEC4' },
    'class': { foreground: '#BCBEC4' },
    'class.declaration': { foreground: '#BCBEC4' },
    'class.defaultLibrary': { foreground: '#BCBEC4' },
    'interface': { foreground: '#BCBEC4' },
    'interface.declaration': { foreground: '#BCBEC4' },
    'enum': { foreground: '#BCBEC4' },
    'struct': { foreground: '#BCBEC4' },
    'record': { foreground: '#BCBEC4' },
    'record.declaration': { foreground: '#BCBEC4' },
    'recordComponent': { foreground: '#C77DBB' },
    'recordComponent.declaration': { foreground: '#C77DBB' },
    'type': { foreground: '#BCBEC4' },
    'typeParameter': { foreground: '#16BAAC' },
    'annotation': { foreground: '#B3AE60' },
    'annotation.importDeclaration': { foreground: '#BCBEC4', fontStyle: '' },
    '*.importDeclaration': { foreground: '#BCBEC4', fontStyle: '' },
    'annotationMember': { foreground: '#BCBEC4' },
    'decorator': { foreground: '#B3AE60' },
    'macro': { foreground: '#B3AE60' },
    'method': { foreground: '#BCBEC4' },
    'method.declaration': { foreground: '#56A8F5' },
    'method.static': { foreground: '#57AAF7', fontStyle: 'italic' },
    'method.static.declaration': { foreground: '#56A8F5', fontStyle: 'italic' },
    '*.constructor': { foreground: '#BCBEC4' },
    '*.declaration.constructor': { foreground: '#56A8F5' },
    'class.constructor': { foreground: '#BCBEC4' },
    'class.declaration.constructor': { foreground: '#56A8F5' },
    'method.constructor': { foreground: '#BCBEC4' },
    'method.declaration.constructor': { foreground: '#56A8F5' },
    'function': { foreground: '#BCBEC4' },
    'function.declaration': { foreground: '#56A8F5' },
    'function.static': { foreground: '#57AAF7', fontStyle: 'italic' },
    'function.defaultLibrary': { foreground: '#57AAF7', fontStyle: 'italic' },
    'property': { foreground: '#C77DBB', fontStyle: '' },
    'property.declaration': { foreground: '#C77DBB', fontStyle: '' },
    'property.readonly': { foreground: '#C77DBB', fontStyle: '' },
    'property.readonly.declaration': { foreground: '#C77DBB', fontStyle: '' },
    'property.static': { foreground: '#C77DBB', fontStyle: '' },
    'property.readonly.static': { foreground: '#C77DBB', fontStyle: 'italic' },
    'property.defaultLibrary': { foreground: '#C77DBB', fontStyle: '' },
    'enumMember': { foreground: '#C77DBB', fontStyle: 'italic' },
    'variable': { foreground: '#BCBEC4', fontStyle: '' },
    'variable.declaration': { foreground: '#BCBEC4', fontStyle: '' },
    'variable.readonly': { foreground: '#BCBEC4', fontStyle: '' },
    'variable.readonly.declaration': { foreground: '#BCBEC4', fontStyle: '' },
    'variable.modification': { foreground: '#BCBEC4', fontStyle: 'underline' },
    'variable.static': { foreground: '#C77DBB', fontStyle: '' },
    'variable.readonly.static': { foreground: '#C77DBB', fontStyle: 'italic' },
    'variable.defaultLibrary': { foreground: '#C77DBB', fontStyle: '' },
    'parameter': { foreground: '#BCBEC4', fontStyle: '' },
    'parameter.declaration': { foreground: '#BCBEC4', fontStyle: '' },
    'parameter.readonly': { foreground: '#BCBEC4', fontStyle: '' },
    'parameter.modification': { foreground: '#BCBEC4', fontStyle: 'underline' },
    'keyword': { foreground: '#CF8E6D' },
    'keyword.documentation': { foreground: '#67A37C', fontStyle: 'italic bold underline' },
    'modifier': { foreground: '#CF8E6D' },
    'string': { foreground: '#6AAB73' },
    'number': { foreground: '#2AACB8' },
    'regexp': { foreground: '#42C3D4' },
    'operator': { foreground: '#BCBEC4' },
    'comment': { foreground: '#7A7E85', fontStyle: 'italic' },
    'comment.documentation': { foreground: '#5F826B', fontStyle: 'italic' }
  },

  // Comprehensive TextMate Scopes matching IntelliJ dark.xml
  tokenColors: [
    {
      name: 'Line & Block Comments',
      scope: ['comment', 'punctuation.definition.comment'],
      settings: {
        foreground: '#7A7E85',
        fontStyle: 'italic'
      }
    },
    {
      name: 'TODO / FIXME Comments',
      scope: [
        'keyword.codetag.notation',
        'comment.block.todo',
        'storage.type.class.todo'
      ],
      settings: {
        foreground: '#8BB33D',
        fontStyle: 'italic'
      }
    },
    {
      name: 'JavaDoc / JSDoc Block Comments',
      scope: [
        'comment.block.documentation',
        'comment.block.javadoc',
        'comment.block.documentation punctuation.definition.comment',
        'comment.block.javadoc punctuation.definition.comment'
      ],
      settings: {
        foreground: '#5F826B',
        fontStyle: 'italic'
      }
    },
    {
      name: 'JavaDoc / JSDoc Tags (@param, @return, @throws)',
      scope: [
        'comment.block.documentation storage.type',
        'storage.type.class.jsdoc',
        'keyword.other.documentation',
        'entity.name.type.instance.jsdoc'
      ],
      settings: {
        foreground: '#67A37C',
        fontStyle: 'italic bold underline'
      }
    },
    {
      name: 'JavaDoc / JSDoc Parameter Variable',
      scope: [
        'comment.block.documentation variable.other',
        'comment.block.documentation variable.parameter',
        'comment.block.javadoc variable.parameter',
        'variable.other.jsdoc'
      ],
      settings: {
        foreground: '#ABADB3',
        fontStyle: ''
      }
    },
    {
      name: 'Keywords, Storage & Language Constants',
      scope: [
        'keyword',
        'keyword.control',
        'keyword.control.new',
        'keyword.operator.new',
        'keyword.operator.expression',
        'keyword.operator.instanceof',
        'keyword.operator.word',
        'keyword.operator.logical.python',
        'storage',
        'storage.type',
        'storage.type.local.java',
        'storage.modifier',
        'constant.language',
        'variable.language.this',
        'variable.language.super',
        'variable.language.java'
      ],
      settings: {
        foreground: '#CF8E6D'
      }
    },
    {
      name: 'Operators, Semicolons, Commas, Brackets & Punctuation (IntelliJ New UI Dark #BCBEC4)',
      scope: [
        'keyword.operator',
        'keyword.operator.assignment',
        'keyword.operator.assignment.arithmetic',
        'keyword.operator.assignment.bitwise',
        'keyword.operator.comparison',
        'keyword.operator.arithmetic',
        'keyword.operator.logical',
        'keyword.operator.bitwise',
        'keyword.operator.ternary',
        'keyword.operator.relational',
        'keyword.operator.increment-decrement',
        'keyword.operator.dereference',
        'keyword.control.ternary',
        'storage.type.function.arrow',
        'storage.type.generic.wildcard',
        'storage.modifier.package.java',
        'storage.modifier.import.java',
        'variable.language.wildcard.java',
        'punctuation.terminator',
        'punctuation.terminator.java',
        'punctuation.separator',
        'punctuation.separator.delimiter',
        'punctuation.separator.period',
        'punctuation.catch.separator',
        'punctuation.accessor',
        'punctuation.section',
        'punctuation.definition.parameters',
        'punctuation.definition.arguments',
        'punctuation.definition.annotation-arguments',
        'punctuation.bracket',
        'meta.brace',
        'constant.other.key.java',
        'entity.name.annotationMember.java'
      ],
      settings: {
        foreground: '#BCBEC4'
      }
    },
    {
      name: 'Java Annotations & TypeScript Decorators (@Service, @Override, @Autowired)',
      scope: [
        'storage.type.annotation',
        'punctuation.definition.annotation',
        'entity.name.function.decorator',
        'punctuation.decorator',
        'meta.decorator entity.name.function',
        'meta.decorator support.function'
      ],
      settings: {
        foreground: '#B3AE60'
      }
    },
    {
      name: 'Method & Function Declarations',
      scope: [
        'meta.method.identifier entity.name.function',
        'meta.method.identifier entity.name.type',
        'meta.definition.method entity.name.function',
        'meta.definition.function entity.name.function',
        'entity.name.function.declaration'
      ],
      settings: {
        foreground: '#56A8F5'
      }
    },
    {
      name: 'Function Calls (fallback when semantic tokens loading)',
      scope: [
        'entity.name.function',
        'entity.name.function.member',
        'meta.function-call entity.name.function',
        'meta.method-call entity.name.function',
        'support.function'
      ],
      settings: {
        foreground: '#BCBEC4'
      }
    },
    {
      name: 'Instance Fields, Object Properties & JSON/YAML Keys',
      scope: [
        'variable.other.property',
        'variable.other.object.property',
        'variable.other.constant.property',
        'meta.field.declaration meta.definition.variable',
        'meta.field.declaration variable.other.definition',
        'support.variable.property',
        'meta.object-literal.key',
        'support.type.property-name.json',
        'entity.name.tag.yaml'
      ],
      settings: {
        foreground: '#C77DBB',
        fontStyle: ''
      }
    },
    {
      name: 'Enum Constants & Static Constants',
      scope: [
        'variable.other.enummember',
        'constant.other.enum',
        'constant.other.java',
        'variable.other.constant.java'
      ],
      settings: {
        foreground: '#C77DBB',
        fontStyle: 'italic'
      }
    },
    {
      name: 'Generic Type Parameters (<T>, <K, V>)',
      scope: [
        'entity.name.type.parameter',
        'meta.type.parameters entity.name.type'
      ],
      settings: {
        foreground: '#16BAAC'
      }
    },
    {
      name: 'Classes, Interfaces, Types & Parameters',
      scope: [
        'entity.name.type',
        'entity.name.class',
        'storage.type.java',
        'storage.type.import.java',
        'storage.type.package.java',
        'storage.type.generic',
        'storage.type.generic.java',
        'storage.type.object.array.java',
        'support.class',
        'support.type',
        'variable.parameter',
        'variable.other.readwrite'
      ],
      settings: {
        foreground: '#BCBEC4'
      }
    },
    {
      name: 'Primitive Types in Java & TypeScript',
      scope: [
        'storage.type.primitive',
        'support.type.primitive.ts',
        'support.type.builtin.ts'
      ],
      settings: {
        foreground: '#CF8E6D'
      }
    },
    {
      name: 'Strings',
      scope: [
        'string',
        'punctuation.definition.string'
      ],
      settings: {
        foreground: '#6AAB73'
      }
    },
    {
      name: 'String Escape Sequences',
      scope: [
        'constant.character.escape',
        'constant.other.placeholder'
      ],
      settings: {
        foreground: '#CF8E6D'
      }
    },
    {
      name: 'Numbers',
      scope: [
        'constant.numeric'
      ],
      settings: {
        foreground: '#2AACB8'
      }
    },
    {
      name: 'Regular Expressions',
      scope: [
        'string.regexp',
        'keyword.operator.quantifier.regexp',
        'constant.character.escape.regexp'
      ],
      settings: {
        foreground: '#42C3D4'
      }
    },
    {
      name: 'Kotlin Named Arguments & Labels',
      scope: [
        'entity.name.label.kotlin',
        'variable.parameter.function.kotlin'
      ],
      settings: {
        foreground: '#56C1D6'
      }
    },
    {
      name: 'React / JSX Components',
      scope: [
        'support.class.component',
        'entity.name.tag.tsx',
        'entity.name.tag.jsx'
      ],
      settings: {
        foreground: '#9C9CFF'
      }
    },
    {
      name: 'HTML, XML, Maven & JSX Tags',
      scope: [
        'entity.name.tag',
        'punctuation.definition.tag'
      ],
      settings: {
        foreground: '#D5B778'
      }
    },
    {
      name: 'HTML, XML & JSX Attributes',
      scope: [
        'entity.other.attribute-name',
        'support.type.property-name.css',
        'support.type.vendored.property-name.css'
      ],
      settings: {
        foreground: '#BABABA'
      }
    },
    {
      name: 'Spring Properties & Dotenv Keys',
      scope: [
        'keyword.other.definition.ini',
        'support.type.property-name.ini',
        'variable.key.dotenv'
      ],
      settings: {
        foreground: '#CF8E6D'
      }
    },
    {
      name: 'Markdown Headings & Links',
      scope: ['markup.heading', 'entity.name.section.markdown'],
      settings: {
        foreground: '#C77DBB',
        fontStyle: 'bold'
      }
    },
    {
      name: 'Markdown Links',
      scope: ['markup.underline.link', 'string.other.link'],
      settings: {
        foreground: '#56A8F5',
        fontStyle: 'underline'
      }
    },
    {
      name: 'Invalid / Illegal Syntax',
      scope: ['invalid', 'invalid.illegal'],
      settings: {
        foreground: '#F75464'
      }
    }
  ]
};

const lightTheme = {
  $schema: 'vscode://schemas/color-theme',
  name: 'IntelliJ IDEA New UI Light (Pro)',
  type: 'light',
  semanticHighlighting: true,
  colors: {
    // 1. Base & Contrast (JetBrains ExperimentalLight)
    'focusBorder': '#3574F0',
    'foreground': '#1E1F22',
    'disabledForeground': '#A8ADBD',
    'widget.border': '#D3D5DB',
    'widget.shadow': '#0000001F',
    'selection.background': '#A6D2FF',
    'descriptionForeground': '#6C707E',
    'errorForeground': '#E53E4D',
    'icon.foreground': '#6C707E',
    'sash.hoverBorder': '#3574F0',

    // 2. Window & Title Bar (New UI Light Main Toolbar #EBECF0)
    'window.activeBorder': '#D3D5DB',
    'window.inactiveBorder': '#EBECF0',
    'titleBar.activeBackground': '#EBECF0',
    'titleBar.activeForeground': '#1E1F22',
    'titleBar.inactiveBackground': '#EBECF0',
    'titleBar.inactiveForeground': '#6C707E',
    'titleBar.border': '#D3D5DB',

    // 3. Menubar & Menus
    'menubar.selectionForeground': '#1E1F22',
    'menubar.selectionBackground': '#DFE1E5',
    'menubar.selectionBorder': '#DFE1E5',
    'menu.foreground': '#1E1F22',
    'menu.background': '#FFFFFF',
    'menu.selectionForeground': '#1E1F22',
    'menu.selectionBackground': '#D4E2FF',
    'menu.selectionBorder': '#D4E2FF',
    'menu.separatorBackground': '#EBECF0',
    'menu.border': '#D3D5DB',

    // 4. Command Center (Search Everywhere / Toolbar Pill)
    'commandCenter.foreground': '#1E1F22',
    'commandCenter.activeForeground': '#000000',
    'commandCenter.background': '#FFFFFF',
    'commandCenter.activeBackground': '#DFE1E5',
    'commandCenter.border': '#D3D5DB',
    'commandCenter.activeBorder': '#3574F0',
    'commandCenter.inactiveForeground': '#6C707E',
    'commandCenter.inactiveBorder': '#D3D5DB',
    'commandCenter.debuggingBackground': '#EBECF0',

    // 5. Activity Bar (Tool Window Bar #EBECF0)
    'activityBar.background': '#EBECF0',
    'activityBar.dropBorder': '#3574F0',
    'activityBar.foreground': '#1E1F22',
    'activityBar.inactiveForeground': '#6C707E',
    'activityBar.border': '#D3D5DB',
    'activityBarBadge.background': '#3574F0',
    'activityBarBadge.foreground': '#FFFFFF',
    'activityBar.activeBorder': '#3574F0',
    'activityBar.activeBackground': '#DFE1E5',
    'activityBar.activeFocusBorder': '#3574F0',
    'activityBarTop.foreground': '#1E1F22',
    'activityBarTop.activeBorder': '#3574F0',
    'activityBarTop.inactiveForeground': '#6C707E',
    'activityBarTop.dropBorder': '#3574F0',
    'activityBarTop.background': '#EBECF0',
    'activityBarTop.activeBackground': '#DFE1E5',

    // 6. Side Bar (Project Tool Window #F7F8FA)
    'sideBar.background': '#F7F8FA',
    'sideBar.foreground': '#1E1F22',
    'sideBar.border': '#EBECF0',
    'sideBar.dropBackground': '#D4E2FF80',
    'sideBarTitle.foreground': '#1E1F22',
    'sideBarTitle.background': '#F7F8FA',
    'sideBarSectionHeader.background': '#F7F8FA',
    'sideBarSectionHeader.foreground': '#1E1F22',
    'sideBarSectionHeader.border': '#EBECF0',
    'sideBarActivityBarTop.border': '#EBECF0',
    'sideBarStickyScroll.background': '#F7F8FA',
    'sideBarStickyScroll.border': '#D3D5DB',

    // 7. Lists & Trees (Project Explorer & Tool Window Trees)
    'list.activeSelectionBackground': '#D4E2FF',
    'list.activeSelectionForeground': '#1E1F22',
    'list.activeSelectionIconForeground': '#1E1F22',
    'list.dropBackground': '#D4E2FF99',
    'list.focusBackground': '#D4E2FF',
    'list.focusForeground': '#1E1F22',
    'list.focusHighlightForeground': '#0033B3',
    'list.focusOutline': '#3574F0',
    'list.focusAndSelectionOutline': '#D4E2FF',
    'list.highlightForeground': '#0033B3',
    'list.hoverBackground': '#EBECF099',
    'list.hoverForeground': '#1E1F22',
    'list.inactiveSelectionBackground': '#DFE1E5',
    'list.inactiveSelectionForeground': '#1E1F22',
    'list.inactiveSelectionIconForeground': '#1E1F22',
    'list.inactiveFocusBackground': '#DFE1E5',
    'list.inactiveFocusOutline': '#DFE1E5',
    'list.invalidItemForeground': '#E53E4D',
    'list.errorForeground': '#1E1F22',
    'list.warningForeground': '#1E1F22',
    'listFilterWidget.background': '#FFFFFF',
    'listFilterWidget.outline': '#3574F0',
    'listFilterWidget.noMatchesOutline': '#E53E4D',
    'listFilterWidget.shadow': '#0000001F',
    'list.filterMatchBackground': '#FCE896',
    'list.filterMatchBorder': '#D9A314',
    'list.deemphasizedForeground': '#6C707E',
    'tree.indentGuidesStroke': '#DFE1E5',
    'tree.inactiveIndentGuidesStroke': '#EBECF0',
    'tree.tableColumnsBorder': '#DFE1E5',
    'tree.tableOddRowsBackground': '#F2F3F5',

    // 8. Buttons, Badges, Checkboxes, Dropdowns, Inputs
    'button.background': '#3574F0',
    'button.foreground': '#FFFFFF',
    'button.border': '#3574F0',
    'button.separator': '#FFFFFF33',
    'button.hoverBackground': '#3065D0',
    'button.secondaryForeground': '#1E1F22',
    'button.secondaryBackground': '#FFFFFF',
    'button.secondaryHoverBackground': '#F7F8FA',
    'checkbox.background': '#FFFFFF',
    'checkbox.foreground': '#1E1F22',
    'checkbox.border': '#C9CCD6',
    'checkbox.selectBackground': '#3574F0',
    'checkbox.selectBorder': '#3574F0',
    'dropdown.background': '#FFFFFF',
    'dropdown.listBackground': '#FFFFFF',
    'dropdown.border': '#C9CCD6',
    'dropdown.foreground': '#1E1F22',
    'input.background': '#FFFFFF',
    'input.border': '#C9CCD6',
    'input.foreground': '#1E1F22',
    'input.placeholderForeground': '#8C92A4',
    'inputOption.activeBackground': '#D4E2FF',
    'inputOption.activeBorder': '#3574F0',
    'inputOption.activeForeground': '#1E1F22',
    'inputOption.hoverBackground': '#EBECF0',
    'inputValidation.errorBackground': '#FCF0F1',
    'inputValidation.errorForeground': '#E53E4D',
    'inputValidation.errorBorder': '#E53E4D',
    'inputValidation.infoBackground': '#EDF3FF',
    'inputValidation.infoForeground': '#1E1F22',
    'inputValidation.infoBorder': '#3574F0',
    'inputValidation.warningBackground': '#FFF8E6',
    'inputValidation.warningForeground': '#A66F00',
    'inputValidation.warningBorder': '#D9A314',
    'badge.foreground': '#1E1F22',
    'badge.background': '#DFE1E5',
    'progressBar.background': '#3574F0',

    // 9. Scrollbar & Minimap
    'scrollbar.shadow': '#00000014',
    'scrollbarSlider.activeBackground': '#6C707EA6',
    'scrollbarSlider.background': '#A8ADBD66',
    'scrollbarSlider.hoverBackground': '#8C92A480',
    'minimap.findMatchHighlight': '#FCE896CC',
    'minimap.selectionHighlight': '#A6D2FFCC',
    'minimap.errorHighlight': '#E53E4D',
    'minimap.warningHighlight': '#D9A314',
    'minimap.background': '#FFFFFF',
    'minimap.selectionOccurrenceHighlight': '#D4E2FFCC',
    'minimapSlider.background': '#A8ADBD40',
    'minimapSlider.hoverBackground': '#8C92A466',
    'minimapSlider.activeBackground': '#6C707E80',
    'minimapGutter.addedBackground': '#7FC784',
    'minimapGutter.modifiedBackground': '#88ADF7',
    'minimapGutter.deletedBackground': '#767A8A',

    // 10. Editor Groups & Tabs (New UI Light Editor Tabs #FFFFFF with 3px #3574F0 underline)
    'editorGroup.border': '#EBECF0',
    'editorGroup.dropBackground': '#D4E2FF4D',
    'editorGroupHeader.noTabsBackground': '#FFFFFF',
    'editorGroupHeader.tabsBackground': '#FFFFFF',
    'editorGroupHeader.tabsBorder': '#EBECF0',
    'editorGroupHeader.border': '#EBECF0',
    'editorGroup.emptyBackground': '#FFFFFF',
    'editorGroup.focusedEmptyBorder': '#3574F0',
    'tab.activeBackground': '#FFFFFF',
    'tab.unfocusedActiveBackground': '#FFFFFF',
    'tab.activeForeground': '#1E1F22',
    'tab.border': '#FFFFFF',
    'tab.activeBorder': '#3574F0',
    'tab.selectedBackground': '#F5F8FE',
    'tab.selectedForeground': '#1E1F22',
    'tab.unfocusedActiveBorder': '#A8ADBD',
    'tab.activeBorderTop': '#00000000',
    'tab.unfocusedActiveBorderTop': '#00000000',
    'tab.lastPinnedBorder': '#D3D5DB',
    'tab.inactiveBackground': '#FFFFFF',
    'tab.unfocusedInactiveBackground': '#FFFFFF',
    'tab.inactiveForeground': '#6C707E',
    'tab.unfocusedActiveForeground': '#6C707E',
    'tab.unfocusedInactiveForeground': '#8C92A4',
    'tab.hoverBackground': '#F7F8FA',
    'tab.unfocusedHoverBackground': '#F7F8FA',
    'tab.hoverForeground': '#1E1F22',
    'tab.unfocusedHoverForeground': '#1E1F22',
    'tab.activeModifiedBorder': '#0062B3',
    'tab.inactiveModifiedBorder': '#0062B380',
    'tab.unfocusedActiveModifiedBorder': '#0062B380',
    'tab.unfocusedInactiveModifiedBorder': '#0062B34D',
    'editorPane.background': '#FFFFFF',

    // 11. Code Editor Canvas, Gutter, Selection & Highlights (JetBrains light.xml)
    'editor.background': '#FFFFFF',
    'editor.foreground': '#080808',
    'editorLineNumber.foreground': '#AEB3C2',
    'editorLineNumber.activeForeground': '#767A8A',
    'editorLineNumber.dimmedForeground': '#C9CCD6',
    'editorCursor.background': '#FFFFFF',
    'editorCursor.foreground': '#080808',
    'editor.selectionBackground': '#A6D2FF',
    'editor.selectionForeground': '#080808',
    'editor.inactiveSelectionBackground': '#D4E2FF80',
    'editor.selectionHighlightBackground': '#D7F7E199',
    'editor.selectionHighlightBorder': '#59A86980',
    'editor.wordHighlightBackground': '#EDEBFC',
    'editor.wordHighlightBorder': '#D0A1FF',
    'editor.wordHighlightStrongBackground': '#FCE8F4',
    'editor.wordHighlightStrongBorder': '#F0A8D2',
    'editor.wordHighlightTextBackground': '#EDEBFC',
    'editor.findMatchBackground': '#FCE896',
    'editor.findMatchBorder': '#D9A314',
    'editor.findMatchHighlightBackground': '#FFF2BD99',
    'editor.findMatchHighlightBorder': '#E5B82E',
    'editor.findRangeHighlightBackground': '#D4E2FF4D',
    'editor.hoverHighlightBackground': '#D4E2FF66',
    'editor.lineHighlightBackground': '#F5F8FE',
    'editor.lineHighlightBorder': '#F5F8FE',
    'editorUnicodeHighlight.border': '#D9A314',
    'editorUnicodeHighlight.background': '#FFF8E699',
    'editorLink.activeForeground': '#005AD9',
    'editor.rangeHighlightBackground': '#F5F8FE99',
    'editor.symbolHighlightBackground': '#FFF2BD99',
    'editorWhitespace.foreground': '#D3D5DB',
    'editorIndentGuide.background1': '#EBECF0',
    'editorIndentGuide.activeBackground1': '#AEB3C2',
    'editorIndentGuide.background2': '#EBECF0',
    'editorIndentGuide.activeBackground2': '#AEB3C2',
    'editorInlayHint.background': '#EBECF0CC',
    'editorInlayHint.foreground': '#6C707E',
    'editorInlayHint.typeBackground': '#EBECF0CC',
    'editorInlayHint.typeForeground': '#6C707E',
    'editorInlayHint.parameterBackground': '#EBECF0CC',
    'editorInlayHint.parameterForeground': '#6C707E',
    'editorRuler.foreground': '#EBECF0',
    'editor.linkedEditingBackground': '#D4E2FF66',
    'editorCodeLens.foreground': '#6C707E',
    'editorLightBulb.foreground': '#D9A314',
    'editorLightBulbAutoFix.foreground': '#E53E4D',
    'editorLightBulbAi.foreground': '#3574F0',
    'editorBracketMatch.background': '#93D9D9',
    'editorBracketMatch.border': '#62B3B3',
    'editorBracketHighlight.foreground1': '#080808',
    'editorBracketHighlight.foreground2': '#080808',
    'editorBracketHighlight.foreground3': '#080808',
    'editorBracketHighlight.foreground4': '#080808',
    'editorBracketHighlight.foreground5': '#080808',
    'editorBracketHighlight.foreground6': '#080808',
    'editorBracketHighlight.unexpectedBracket.foreground': '#E53E4D',
    'editorBracketPairGuide.activeBackground1': '#AEB3C2',
    'editorBracketPairGuide.background1': '#EBECF0',
    'editor.foldBackground': '#F7F8FA99',
    'editor.foldPlaceholderForeground': '#6C707E',
    'editorGutter.background': '#FFFFFF',
    'editorGutter.modifiedBackground': '#88ADF7',
    'editorGutter.addedBackground': '#7FC784',
    'editorGutter.deletedBackground': '#767A8A',
    'editorGutter.commentRangeForeground': '#C9CCD6',
    'editorGutter.foldingControlForeground': '#6C707E',
    'editorUnnecessaryCode.opacity': '#00000066',
    'editorGhostText.foreground': '#8C92A4',

    // 12. Sticky Scroll & Breadcrumbs
    'editorStickyScroll.background': '#FFFFFF',
    'editorStickyScrollHover.background': '#F5F8FE',
    'editorStickyScroll.border': '#EBECF0',
    'editorStickyScroll.shadow': '#00000014',
    'breadcrumb.foreground': '#6C707E',
    'breadcrumb.background': '#FFFFFF',
    'breadcrumb.focusForeground': '#1E1F22',
    'breadcrumb.activeSelectionForeground': '#1E1F22',
    'breadcrumbPicker.background': '#F7F8FA',

    // 13. Editor Overview Ruler, Errors, Warnings & Widgets
    'editorError.foreground': '#E53E4D',
    'editorError.border': '#00000000',
    'editorWarning.foreground': '#D9A314',
    'editorWarning.border': '#00000000',
    'editorInfo.foreground': '#7A9E6B99',
    'editorHint.foreground': '#A68A3E',
    'problemsErrorIcon.foreground': '#E53E4D',
    'problemsWarningIcon.foreground': '#D9A314',
    'problemsInfoIcon.foreground': '#3574F0',
    'editorOverviewRuler.border': '#EBECF0',
    'editorOverviewRuler.findMatchForeground': '#D9A314B3',
    'editorOverviewRuler.rangeHighlightForeground': '#3574F080',
    'editorOverviewRuler.selectionHighlightForeground': '#59A869CC',
    'editorOverviewRuler.wordHighlightForeground': '#D0A1FFCC',
    'editorOverviewRuler.wordHighlightStrongForeground': '#F0A8D2CC',
    'editorOverviewRuler.modifiedForeground': '#88ADF7',
    'editorOverviewRuler.addedForeground': '#7FC784',
    'editorOverviewRuler.deletedForeground': '#767A8A',
    'editorOverviewRuler.errorForeground': '#E53E4D',
    'editorOverviewRuler.warningForeground': '#D9A314',
    'editorOverviewRuler.infoForeground': '#3574F0',
    'editorOverviewRuler.bracketMatchForeground': '#8C92A4',
    'editorWidget.foreground': '#1E1F22',
    'editorWidget.background': '#F7F8FA',
    'editorWidget.border': '#D3D5DB',
    'editorWidget.resizeBorder': '#3574F0',
    'editorSuggestWidget.background': '#FFFFFF',
    'editorSuggestWidget.border': '#D3D5DB',
    'editorSuggestWidget.foreground': '#1E1F22',
    'editorSuggestWidget.focusHighlightForeground': '#005AD9',
    'editorSuggestWidget.highlightForeground': '#005AD9',
    'editorSuggestWidget.selectedBackground': '#D4E2FF',
    'editorSuggestWidget.selectedForeground': '#1E1F22',
    'editorSuggestWidget.selectedIconForeground': '#1E1F22',
    'editorHoverWidget.foreground': '#1E1F22',
    'editorHoverWidget.background': '#F7F8FA',
    'editorHoverWidget.border': '#D3D5DB',
    'editorHoverWidget.highlightForeground': '#005AD9',
    'editorHoverWidget.statusBarBackground': '#EBECF0',

    // 14. Diff & Merge Editor (IntelliJ Light 3-color palette: Blue #C2D8F266 + Gray #B8B8B899 for old/removed block, Green #BEE6BE80 + #89C398B3 for new/inserted block)
    'diffEditor.insertedLineBackground': '#BEE6BE80',
    'diffEditor.removedLineBackground': '#C2D8F266',
    'diffEditor.insertedTextBackground': '#89C398B3',
    'diffEditor.removedTextBackground': '#B8B8B899',
    'diffEditorGutter.insertedLineBackground': '#BEE6BE',
    'diffEditorGutter.removedLineBackground': '#C2D8F2',
    'diffEditorOverview.insertedForeground': '#40A654',
    'diffEditorOverview.removedForeground': '#767A8A',
    'diffEditor.diagonalFill': '#00000000',
    'diffEditor.border': '#EBECF0',
    'merge.currentHeaderBackground': '#A3E4B5CC',
    'merge.currentContentBackground': '#BEE6BE66',
    'merge.incomingHeaderBackground': '#B6D2F2CC',
    'merge.incomingContentBackground': '#C2D8F266',
    'merge.border': '#D3D5DB',
    'editorOverviewRuler.currentContentForeground': '#40A654',
    'editorOverviewRuler.incomingContentForeground': '#3574F0',
    'mergeEditor.change.background': '#BEE6BE80',
    'mergeEditor.change.word.background': '#89C398B3',
    'mergeEditor.changeBase.background': '#C2D8F266',
    'mergeEditor.changeBase.word.background': '#B8B8B899',

    // 15. Peek View & Quick Input (Search Everywhere / Go to Class Popup)
    'peekView.border': '#D3D5DB',
    'peekViewEditor.background': '#FFFFFF',
    'peekViewEditorGutter.background': '#FFFFFF',
    'peekViewEditor.matchHighlightBackground': '#FCE896',
    'peekViewEditor.matchHighlightBorder': '#D9A314',
    'peekViewResult.background': '#F7F8FA',
    'peekViewResult.fileForeground': '#1E1F22',
    'peekViewResult.lineForeground': '#4E5157',
    'peekViewResult.matchHighlightBackground': '#FCE896',
    'peekViewResult.selectionBackground': '#D4E2FF',
    'peekViewResult.selectionForeground': '#1E1F22',
    'peekViewTitle.background': '#EBECF0',
    'peekViewTitleDescription.foreground': '#6C707E',
    'peekViewTitleLabel.foreground': '#1E1F22',
    'pickerGroup.border': '#EBECF0',
    'pickerGroup.foreground': '#3574F0',
    'quickInput.background': '#FFFFFF',
    'quickInput.foreground': '#1E1F22',
    'quickInputTitle.background': '#F7F8FA',
    'quickInputList.focusBackground': '#D4E2FF',
    'quickInputList.focusForeground': '#1E1F22',
    'quickInputList.focusIconForeground': '#1E1F22',

    // 16. Panels & JetBrains JediTerm Light Terminal (16 ANSI Colors)
    'panel.background': '#F7F8FA',
    'panel.border': '#EBECF0',
    'panel.dropBorder': '#3574F0',
    'panelTitle.activeBorder': '#3574F0',
    'panelTitle.activeForeground': '#1E1F22',
    'panelTitle.inactiveForeground': '#6C707E',
    'panelInput.border': '#C9CCD6',
    'panelSection.border': '#EBECF0',
    'panelSection.dropBackground': '#D4E2FF55',
    'panelSectionHeader.background': '#F7F8FA',
    'panelSectionHeader.foreground': '#1E1F22',
    'panelSectionHeader.border': '#EBECF0',
    'terminal.background': '#FFFFFF',
    'terminal.foreground': '#080808',
    'terminal.border': '#EBECF0',
    'terminalCursor.background': '#FFFFFF',
    'terminalCursor.foreground': '#080808',
    'terminal.selectionBackground': '#A6D2FF',
    'terminal.inactiveSelectionBackground': '#D4E2FF80',
    'terminal.findMatchBackground': '#FCE896',
    'terminal.findMatchBorder': '#D9A314',
    'terminal.findMatchHighlightBackground': '#FFF2BD99',
    'terminalCommandDecoration.defaultBackground': '#8C92A4',
    'terminalCommandDecoration.successBackground': '#208A3C',
    'terminalCommandDecoration.errorBackground': '#E53E4D',
    'terminal.ansiBlack': '#080808',
    'terminal.ansiBrightBlack': '#6C707E',
    'terminal.ansiRed': '#C92A2A',
    'terminal.ansiBrightRed': '#E53E4D',
    'terminal.ansiGreen': '#067D17',
    'terminal.ansiBrightGreen': '#208A3C',
    'terminal.ansiYellow': '#A66F00',
    'terminal.ansiBrightYellow': '#C28500',
    'terminal.ansiBlue': '#0033B3',
    'terminal.ansiBrightBlue': '#3574F0',
    'terminal.ansiMagenta': '#871094',
    'terminal.ansiBrightMagenta': '#A526B3',
    'terminal.ansiCyan': '#00627A',
    'terminal.ansiBrightCyan': '#007E8A',
    'terminal.ansiWhite': '#6C707E',
    'terminal.ansiBrightWhite': '#1E1F22',

    // 17. Status Bar (JetBrains Light Bottom Bar #F7F8FA)
    'statusBar.background': '#F7F8FA',
    'statusBar.foreground': '#4E5157',
    'statusBar.border': '#D3D5DB',
    'statusBar.debuggingBackground': '#F7F8FA',
    'statusBar.debuggingForeground': '#1E1F22',
    'statusBar.debuggingBorder': '#3574F0',
    'statusBar.noFolderForeground': '#6C707E',
    'statusBar.noFolderBackground': '#F7F8FA',
    'statusBar.noFolderBorder': '#D3D5DB',
    'statusBarItem.activeBackground': '#D3D5DB',
    'statusBarItem.hoverForeground': '#1E1F22',
    'statusBarItem.hoverBackground': '#DFE1E5',
    'statusBarItem.prominentForeground': '#1E1F22',
    'statusBarItem.prominentBackground': '#DFE1E5',
    'statusBarItem.prominentHoverBackground': '#D3D5DB',
    'statusBarItem.remoteBackground': '#3574F0',
    'statusBarItem.remoteForeground': '#FFFFFF',
    'statusBarItem.errorBackground': '#E53E4D',
    'statusBarItem.errorForeground': '#FFFFFF',
    'statusBarItem.warningBackground': '#D9A314',
    'statusBarItem.warningForeground': '#FFFFFF',

    // 18. Antigravity Chat, Inline Chat, Debug, Git & Notifications
    'chat.requestBorder': '#EBECF0',
    'chat.requestBackground': '#FFFFFF',
    'chat.slashCommandBackground': '#D4E2FF',
    'chat.slashCommandForeground': '#0033B3',
    'chat.avatarBackground': '#3574F0',
    'chat.avatarForeground': '#FFFFFF',
    'inlineChat.background': '#F7F8FA',
    'inlineChat.border': '#D3D5DB',
    'inlineChat.shadow': '#0000001F',
    'inlineChatInput.border': '#C9CCD6',
    'inlineChatInput.focusBorder': '#3574F0',
    'inlineChatInput.placeholderForeground': '#8C92A4',
    'inlineChatInput.background': '#FFFFFF',
    'inlineChatDiff.inserted': '#D1F2D980',
    'inlineChatDiff.removed': '#FAD9DC80',
    'debugToolBar.background': '#F7F8FA',
    'debugToolBar.border': '#D3D5DB',
    'editor.focusedStackFrameHighlightBackground': '#D4E2FF99',
    'editor.stackFrameHighlightBackground': '#FFF2BD99',
    'debugIcon.breakpointForeground': '#E53E4D',
    'debugIcon.breakpointDisabledForeground': '#A8ADBD',
    'debugIcon.breakpointUnverifiedForeground': '#6C707E',
    'debugIcon.startForeground': '#208A3C',
    'debugIcon.pauseForeground': '#D9A314',
    'debugIcon.stopForeground': '#E53E4D',
    'debugIcon.disconnectForeground': '#E53E4D',
    'debugIcon.restartForeground': '#208A3C',
    'debugIcon.stepOverForeground': '#3574F0',
    'debugIcon.stepIntoForeground': '#3574F0',
    'debugIcon.stepOutForeground': '#3574F0',
    'debugIcon.continueForeground': '#208A3C',
    'debugTokenExpression.name': '#871094',
    'debugTokenExpression.value': '#080808',
    'debugTokenExpression.string': '#067D17',
    'debugTokenExpression.boolean': '#0033B3',
    'debugTokenExpression.number': '#1750EB',
    'debugTokenExpression.error': '#E53E4D',
    'gitDecoration.addedResourceForeground': '#067D17',
    'gitDecoration.modifiedResourceForeground': '#0033B3',
    'gitDecoration.deletedResourceForeground': '#6C707E',
    'gitDecoration.renamedResourceForeground': '#00627A',
    'gitDecoration.stageModifiedResourceForeground': '#0033B3',
    'gitDecoration.stageDeletedResourceForeground': '#6C707E',
    'gitDecoration.untrackedResourceForeground': '#B34329',
    'gitDecoration.ignoredResourceForeground': '#8C92A4',
    'gitDecoration.conflictingResourceForeground': '#E53E4D',
    'gitDecoration.submoduleResourceForeground': '#0033B3',
    'notificationCenter.border': '#D3D5DB',
    'notificationCenterHeader.foreground': '#1E1F22',
    'notificationCenterHeader.background': '#F7F8FA',
    'notificationToast.border': '#D3D5DB',
    'notifications.foreground': '#1E1F22',
    'notifications.background': '#FFFFFF',
    'notifications.border': '#D3D5DB',
    'notificationLink.foreground': '#005AD9',
    'notificationsErrorIcon.foreground': '#E53E4D',
    'notificationsWarningIcon.foreground': '#D9A314',
    'notificationsInfoIcon.foreground': '#3574F0',
    'textLink.foreground': '#005AD9',
    'textLink.activeForeground': '#3574F0',
    'textPreformat.foreground': '#080808',
    'textPreformat.background': '#EBECF0',
    'textBlockQuote.background': '#F7F8FA',
    'textBlockQuote.border': '#3574F0',
    'textCodeBlock.background': '#F7F8FA',
    'keybindingLabel.background': '#EBECF0',
    'keybindingLabel.foreground': '#1E1F22',
    'keybindingLabel.border': '#C9CCD6',
    'keybindingLabel.bottomBorder': '#C9CCD6',
    'settings.headerForeground': '#1E1F22',
    'settings.modifiedItemIndicator': '#3574F0',
    'settings.dropdownBackground': '#FFFFFF',
    'settings.dropdownForeground': '#1E1F22',
    'settings.dropdownBorder': '#C9CCD6',
    'settings.checkboxBackground': '#3574F0',
    'settings.checkboxForeground': '#FFFFFF',
    'settings.checkboxBorder': '#3574F0',
    'settings.textInputBackground': '#FFFFFF',
    'settings.textInputForeground': '#1E1F22',
    'settings.textInputBorder': '#C9CCD6',
    'settings.numberInputBackground': '#FFFFFF',
    'settings.numberInputForeground': '#1E1F22',
    'settings.numberInputBorder': '#C9CCD6',
    'welcomePage.background': '#FFFFFF',
    'welcomePage.tileBackground': '#F7F8FA',
    'welcomePage.tileHoverBackground': '#EBECF0',
    'welcomePage.tileBorder': '#EBECF0',
    'symbolIcon.classForeground': '#3574F0',
    'symbolIcon.interfaceForeground': '#208A3C',
    'symbolIcon.enumeratorForeground': '#834DF0',
    'symbolIcon.methodForeground': '#C27D00',
    'symbolIcon.functionForeground': '#C27D00',
    'symbolIcon.constructorForeground': '#C27D00',
    'symbolIcon.fieldForeground': '#0033B3',
    'symbolIcon.propertyForeground': '#871094',
    'symbolIcon.packageForeground': '#6C707E',
    'symbolIcon.namespaceForeground': '#6C707E'
  },

  // Deep Semantic Highlighting (JetBrains light.xml exact rules)
  semanticTokenColors: {
    'namespace': { foreground: '#080808' },
    'package': { foreground: '#080808' },
    'class': { foreground: '#080808' },
    'class.declaration': { foreground: '#080808' },
    'class.defaultLibrary': { foreground: '#080808' },
    'interface': { foreground: '#080808' },
    'interface.declaration': { foreground: '#080808' },
    'enum': { foreground: '#080808' },
    'struct': { foreground: '#080808' },
    'record': { foreground: '#080808' },
    'record.declaration': { foreground: '#080808' },
    'recordComponent': { foreground: '#871094' },
    'recordComponent.declaration': { foreground: '#871094' },
    'type': { foreground: '#080808' },
    'typeParameter': { foreground: '#007E8A' },
    'annotation': { foreground: '#9E880D' },
    'annotation.importDeclaration': { foreground: '#080808', fontStyle: '' },
    '*.importDeclaration': { foreground: '#080808', fontStyle: '' },
    'annotationMember': { foreground: '#080808' },
    'decorator': { foreground: '#9E880D' },
    'macro': { foreground: '#9E880D' },
    'method': { foreground: '#080808' },
    'method.declaration': { foreground: '#00627A' },
    'method.static': { foreground: '#080808', fontStyle: 'italic' },
    'method.static.declaration': { foreground: '#00627A', fontStyle: 'italic' },
    '*.constructor': { foreground: '#080808' },
    '*.declaration.constructor': { foreground: '#00627A' },
    'class.constructor': { foreground: '#080808' },
    'class.declaration.constructor': { foreground: '#00627A' },
    'method.constructor': { foreground: '#080808' },
    'method.declaration.constructor': { foreground: '#00627A' },
    'function': { foreground: '#080808' },
    'function.declaration': { foreground: '#00627A' },
    'function.static': { foreground: '#080808', fontStyle: 'italic' },
    'function.defaultLibrary': { foreground: '#080808', fontStyle: 'italic' },
    'property': { foreground: '#871094', fontStyle: '' },
    'property.declaration': { foreground: '#871094', fontStyle: '' },
    'property.readonly': { foreground: '#871094', fontStyle: '' },
    'property.readonly.declaration': { foreground: '#871094', fontStyle: '' },
    'property.static': { foreground: '#871094', fontStyle: '' },
    'property.readonly.static': { foreground: '#871094', fontStyle: 'italic' },
    'property.defaultLibrary': { foreground: '#871094', fontStyle: '' },
    'enumMember': { foreground: '#871094', fontStyle: 'italic' },
    'variable': { foreground: '#080808', fontStyle: '' },
    'variable.declaration': { foreground: '#080808', fontStyle: '' },
    'variable.readonly': { foreground: '#080808', fontStyle: '' },
    'variable.readonly.declaration': { foreground: '#080808', fontStyle: '' },
    'variable.modification': { foreground: '#080808', fontStyle: 'underline' },
    'variable.static': { foreground: '#871094', fontStyle: '' },
    'variable.readonly.static': { foreground: '#871094', fontStyle: 'italic' },
    'variable.defaultLibrary': { foreground: '#871094', fontStyle: '' },
    'parameter': { foreground: '#080808', fontStyle: '' },
    'parameter.declaration': { foreground: '#080808', fontStyle: '' },
    'parameter.readonly': { foreground: '#080808', fontStyle: '' },
    'parameter.modification': { foreground: '#080808', fontStyle: 'underline' },
    'keyword': { foreground: '#0033B3' },
    'keyword.documentation': { foreground: '#8C8C8C', fontStyle: 'italic bold underline' },
    'modifier': { foreground: '#0033B3' },
    'string': { foreground: '#067D17' },
    'number': { foreground: '#1750EB' },
    'regexp': { foreground: '#264EFF' },
    'operator': { foreground: '#080808' },
    'comment': { foreground: '#8C8C8C', fontStyle: 'italic' },
    'comment.documentation': { foreground: '#8C8C8C', fontStyle: 'italic' }
  },

  // Comprehensive TextMate Scopes matching IntelliJ light.xml
  tokenColors: [
    {
      name: 'Line & Block Comments',
      scope: ['comment', 'punctuation.definition.comment'],
      settings: {
        foreground: '#8C8C8C',
        fontStyle: 'italic'
      }
    },
    {
      name: 'TODO / FIXME Comments',
      scope: [
        'keyword.codetag.notation',
        'comment.block.todo',
        'storage.type.class.todo'
      ],
      settings: {
        foreground: '#008DDE',
        fontStyle: 'italic'
      }
    },
    {
      name: 'JavaDoc / JSDoc Block Comments',
      scope: [
        'comment.block.documentation',
        'comment.block.javadoc',
        'comment.block.documentation punctuation.definition.comment',
        'comment.block.javadoc punctuation.definition.comment'
      ],
      settings: {
        foreground: '#8C8C8C',
        fontStyle: 'italic'
      }
    },
    {
      name: 'JavaDoc / JSDoc Tags (@param, @return, @throws)',
      scope: [
        'comment.block.documentation storage.type',
        'storage.type.class.jsdoc',
        'keyword.other.documentation',
        'entity.name.type.instance.jsdoc'
      ],
      settings: {
        foreground: '#8C8C8C',
        fontStyle: 'italic bold underline'
      }
    },
    {
      name: 'JavaDoc / JSDoc Parameter Variable',
      scope: [
        'comment.block.documentation variable.other',
        'comment.block.documentation variable.parameter',
        'comment.block.javadoc variable.parameter',
        'variable.other.jsdoc'
      ],
      settings: {
        foreground: '#3D3D3D',
        fontStyle: 'italic'
      }
    },
    {
      name: 'Keywords, Storage & Language Constants',
      scope: [
        'keyword',
        'keyword.control',
        'keyword.control.new',
        'keyword.operator.new',
        'keyword.operator.expression',
        'keyword.operator.instanceof',
        'keyword.operator.word',
        'keyword.operator.logical.python',
        'storage',
        'storage.type',
        'storage.type.local.java',
        'storage.modifier',
        'constant.language',
        'variable.language.this',
        'variable.language.super',
        'variable.language.java'
      ],
      settings: {
        foreground: '#0033B3'
      }
    },
    {
      name: 'Operators, Semicolons, Commas, Brackets & Punctuation (IntelliJ New UI Light #080808)',
      scope: [
        'keyword.operator',
        'keyword.operator.assignment',
        'keyword.operator.assignment.arithmetic',
        'keyword.operator.assignment.bitwise',
        'keyword.operator.comparison',
        'keyword.operator.arithmetic',
        'keyword.operator.logical',
        'keyword.operator.bitwise',
        'keyword.operator.ternary',
        'keyword.operator.relational',
        'keyword.operator.increment-decrement',
        'keyword.operator.dereference',
        'keyword.control.ternary',
        'storage.type.function.arrow',
        'storage.type.generic.wildcard',
        'storage.modifier.package.java',
        'storage.modifier.import.java',
        'variable.language.wildcard.java',
        'punctuation.terminator',
        'punctuation.terminator.java',
        'punctuation.separator',
        'punctuation.separator.delimiter',
        'punctuation.separator.period',
        'punctuation.catch.separator',
        'punctuation.accessor',
        'punctuation.section',
        'punctuation.definition.parameters',
        'punctuation.definition.arguments',
        'punctuation.definition.annotation-arguments',
        'punctuation.bracket',
        'meta.brace',
        'constant.other.key.java',
        'entity.name.annotationMember.java'
      ],
      settings: {
        foreground: '#080808'
      }
    },
    {
      name: 'Java Annotations & TypeScript Decorators (@Service, @Override, @Autowired)',
      scope: [
        'storage.type.annotation',
        'punctuation.definition.annotation',
        'entity.name.function.decorator',
        'punctuation.decorator',
        'meta.decorator entity.name.function',
        'meta.decorator support.function'
      ],
      settings: {
        foreground: '#9E880D'
      }
    },
    {
      name: 'Method & Function Declarations',
      scope: [
        'meta.method.identifier entity.name.function',
        'meta.method.identifier entity.name.type',
        'meta.definition.method entity.name.function',
        'meta.definition.function entity.name.function',
        'entity.name.function.declaration'
      ],
      settings: {
        foreground: '#00627A'
      }
    },
    {
      name: 'Function Calls (fallback when semantic tokens loading)',
      scope: [
        'entity.name.function',
        'entity.name.function.member',
        'meta.function-call entity.name.function',
        'meta.method-call entity.name.function',
        'support.function'
      ],
      settings: {
        foreground: '#080808'
      }
    },
    {
      name: 'Instance Fields, Object Properties & JSON/YAML Keys',
      scope: [
        'variable.other.property',
        'variable.other.object.property',
        'variable.other.constant.property',
        'meta.field.declaration meta.definition.variable',
        'meta.field.declaration variable.other.definition',
        'support.variable.property',
        'meta.object-literal.key',
        'support.type.property-name.json',
        'entity.name.tag.yaml'
      ],
      settings: {
        foreground: '#871094',
        fontStyle: ''
      }
    },
    {
      name: 'Enum Constants & Static Constants',
      scope: [
        'variable.other.enummember',
        'constant.other.enum',
        'constant.other.java',
        'variable.other.constant.java'
      ],
      settings: {
        foreground: '#871094',
        fontStyle: 'italic'
      }
    },
    {
      name: 'Generic Type Parameters (<T>, <K, V>)',
      scope: [
        'entity.name.type.parameter',
        'meta.type.parameters entity.name.type'
      ],
      settings: {
        foreground: '#007E8A'
      }
    },
    {
      name: 'Classes, Interfaces, Types & Parameters',
      scope: [
        'entity.name.type',
        'entity.name.class',
        'storage.type.java',
        'storage.type.import.java',
        'storage.type.package.java',
        'storage.type.generic',
        'storage.type.generic.java',
        'storage.type.object.array.java',
        'support.class',
        'support.type',
        'variable.parameter',
        'variable.other.readwrite'
      ],
      settings: {
        foreground: '#080808'
      }
    },
    {
      name: 'Primitive Types in Java & TypeScript',
      scope: [
        'storage.type.primitive',
        'support.type.primitive.ts',
        'support.type.builtin.ts'
      ],
      settings: {
        foreground: '#0033B3'
      }
    },
    {
      name: 'Strings',
      scope: [
        'string',
        'punctuation.definition.string'
      ],
      settings: {
        foreground: '#067D17'
      }
    },
    {
      name: 'String Escape Sequences',
      scope: [
        'constant.character.escape',
        'constant.other.placeholder'
      ],
      settings: {
        foreground: '#0037A6'
      }
    },
    {
      name: 'Numbers',
      scope: [
        'constant.numeric'
      ],
      settings: {
        foreground: '#1750EB'
      }
    },
    {
      name: 'Regular Expressions',
      scope: [
        'string.regexp',
        'keyword.operator.quantifier.regexp',
        'constant.character.escape.regexp'
      ],
      settings: {
        foreground: '#264EFF'
      }
    },
    {
      name: 'JavaScript / TypeScript Local Variables',
      scope: [
        'variable.other.readwrite.js',
        'variable.other.readwrite.ts',
        'variable.other.readwrite.jsx',
        'variable.other.readwrite.tsx'
      ],
      settings: {
        foreground: '#2A8C7C'
      }
    },
    {
      name: 'JavaScript / TypeScript Global Variables',
      scope: [
        'variable.other.global.js',
        'variable.other.global.ts',
        'support.variable.dom'
      ],
      settings: {
        foreground: '#830091'
      }
    },
    {
      name: 'React / JSX Components',
      scope: [
        'support.class.component',
        'entity.name.tag.tsx',
        'entity.name.tag.jsx'
      ],
      settings: {
        foreground: '#AD6339'
      }
    },
    {
      name: 'HTML, XML, Maven & JSX Tags',
      scope: [
        'entity.name.tag',
        'punctuation.definition.tag'
      ],
      settings: {
        foreground: '#0033B3'
      }
    },
    {
      name: 'HTML, XML & JSX Attributes',
      scope: [
        'entity.other.attribute-name',
        'support.type.property-name.css',
        'support.type.vendored.property-name.css'
      ],
      settings: {
        foreground: '#174AD4'
      }
    },
    {
      name: 'Spring Properties & Dotenv Keys',
      scope: [
        'keyword.other.definition.ini',
        'support.type.property-name.ini',
        'variable.key.dotenv'
      ],
      settings: {
        foreground: '#083080'
      }
    },
    {
      name: 'Markdown Headings & Links',
      scope: ['markup.heading', 'entity.name.section.markdown'],
      settings: {
        foreground: '#871094',
        fontStyle: 'bold'
      }
    },
    {
      name: 'Markdown Links',
      scope: ['markup.underline.link', 'string.other.link'],
      settings: {
        foreground: '#005AD9',
        fontStyle: 'underline'
      }
    },
    {
      name: 'Invalid / Illegal Syntax',
      scope: ['invalid', 'invalid.illegal'],
      settings: {
        foreground: '#E53E4D'
      }
    }
  ]
};

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(theme, null, 2), 'utf8');
console.log(`Generated ${OUT_PATH} with ${Object.keys(theme.colors).length} workbench colors.`);

fs.writeFileSync(LIGHT_OUT_PATH, JSON.stringify(lightTheme, null, 2), 'utf8');
console.log(`Generated ${LIGHT_OUT_PATH} with ${Object.keys(lightTheme.colors).length} workbench colors.`);

