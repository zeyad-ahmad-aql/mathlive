// @ts-ignore-error
import MATHFIELD_STYLESHEET from '../../css/mathfield.less';

// @ts-ignore-error
import CORE_STYLESHEET from '../../css/core.less';

// @ts-ignore-error
import ENVIRONMENT_POPOVER_STYLESHEET from '../../css/environment-popover.less';

// @ts-ignore-error
import SUGGESTION_POPOVER_STYLESHEET from '../../css/suggestion-popover.less';

// @ts-ignore-error
import KEYSTROKE_CAPTION_STYLESHEET from '../../css/keystroke-caption.less';

// @ts-ignore-error
import VIRTUAL_KEYBOARD_STYLESHEET from '../../css/virtual-keyboard.less' assert { type: 'css' };

type StylesheetId =
  | 'core'
  | 'mathfield-element'
  | 'mathfield'
  | 'environment-popover'
  | 'suggestion-popover'
  | 'keystroke-caption'
  | 'virtual-keyboard';

let gStylesheets: Partial<Record<StylesheetId, CSSStyleSheet>>;

export function getStylesheet(id: StylesheetId): CSSStyleSheet {
  if (!gStylesheets) gStylesheets = {};

  if (gStylesheets[id]) return gStylesheets[id]!;

  gStylesheets[id] = new CSSStyleSheet();

  let content = '';

  switch (id) {
    //
    // Note: the `position: relative` is required to fix https://github.com/arnog/mathlive/issues/971
    //
    case 'mathfield-element':
      content = `
    :host { display: inline-block; background-color: field; color: fieldtext; border-width: 1px; border-style: solid; border-color: #acacac; border-radius: 2px; padding:4px; pointer-events: none;}
    :host([hidden]) { display: none; }
    :host([disabled]), :host([disabled]:focus), :host([disabled]:focus-within) { outline: none; opacity:  .5; }
    :host(:focus), :host(:focus-within) {
      outline: Highlight auto 1px;    /* For Firefox */
      outline: -webkit-focus-ring-color auto 1px;
    }
    :host([readonly]:focus), :host([readonly]:focus-within),
    :host([read-only]:focus), :host([read-only]:focus-within) {
      outline: none;
    }`;
      break;
    case 'core':
      content = CORE_STYLESHEET;
      break;
    case 'mathfield':
      content = MATHFIELD_STYLESHEET;
      break;
    case 'environment-popover':
      content = ENVIRONMENT_POPOVER_STYLESHEET;
      break;
    case 'suggestion-popover':
      content = SUGGESTION_POPOVER_STYLESHEET;
      break;
    case 'keystroke-caption':
      content = KEYSTROKE_CAPTION_STYLESHEET;
      break;
    case 'virtual-keyboard':
      content = VIRTUAL_KEYBOARD_STYLESHEET;
      break;
    default:
      debugger;
  }

  gStylesheets[id]!.replaceSync(content);

  return gStylesheets[id]!;
}

let gInjectedStylesheets: Partial<Record<StylesheetId, number>>;

export function injectStylesheet(id: StylesheetId): void {
  if (!gInjectedStylesheets) gInjectedStylesheets = {};
  if (gInjectedStylesheets[id] !== undefined) gInjectedStylesheets[id]! += 1;
  else {
    const stylesheet = getStylesheet(id);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet];
    gInjectedStylesheets[id] = 0;
  }
}

export function releaseStylesheet(id: StylesheetId): void {
  if (!gInjectedStylesheets?.[id]) return;

  gInjectedStylesheets[id]! -= 1;
  if (gInjectedStylesheets[id]! <= 1) {
    const stylesheet = gStylesheets[id]!;
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
      (x) => x !== stylesheet
    );
  }
}
