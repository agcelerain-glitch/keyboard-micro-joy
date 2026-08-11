import type { KeyboardLayout, KeyDef } from './types'

const keys: KeyDef[] = [
  // Row 0 — Number row
  { code: 'Backquote',  label: '`',  label2: '~',  row: 0, col: 0,  width: 1,    side: 'left'  },
  { code: 'Digit1',     label: '1',  label2: '!',  row: 0, col: 1,  width: 1,    side: 'left'  },
  { code: 'Digit2',     label: '2',  label2: '@',  row: 0, col: 2,  width: 1,    side: 'left'  },
  { code: 'Digit3',     label: '3',  label2: '#',  row: 0, col: 3,  width: 1,    side: 'left'  },
  { code: 'Digit4',     label: '4',  label2: '$',  row: 0, col: 4,  width: 1,    side: 'left'  },
  { code: 'Digit5',     label: '5',  label2: '%',  row: 0, col: 5,  width: 1,    side: 'left'  },
  { code: 'Digit6',     label: '6',  label2: '^',  row: 0, col: 6,  width: 1,    side: 'right' },
  { code: 'Digit7',     label: '7',  label2: '&',  row: 0, col: 7,  width: 1,    side: 'right' },
  { code: 'Digit8',     label: '8',  label2: '*',  row: 0, col: 8,  width: 1,    side: 'right' },
  { code: 'Digit9',     label: '9',  label2: '(',  row: 0, col: 9,  width: 1,    side: 'right' },
  { code: 'Digit0',     label: '0',  label2: ')',  row: 0, col: 10, width: 1,    side: 'right' },
  { code: 'Minus',      label: '-',  label2: '_',  row: 0, col: 11, width: 1,    side: 'right' },
  { code: 'Equal',      label: '=',  label2: '+',  row: 0, col: 12, width: 1,    side: 'right' },
  { code: 'Backspace',  label: 'BS',               row: 0, col: 13, width: 2,    side: 'right' },

  // Row 1 — QWERTY
  { code: 'Tab',         label: 'Tab',              row: 1, col: 0,  width: 1.5,  side: 'left'  },
  { code: 'KeyQ',        label: 'Q',                row: 1, col: 1,  width: 1,    side: 'left'  },
  { code: 'KeyW',        label: 'W',                row: 1, col: 2,  width: 1,    side: 'left'  },
  { code: 'KeyE',        label: 'E',                row: 1, col: 3,  width: 1,    side: 'left'  },
  { code: 'KeyR',        label: 'R',                row: 1, col: 4,  width: 1,    side: 'left'  },
  { code: 'KeyT',        label: 'T',                row: 1, col: 5,  width: 1,    side: 'left'  },
  { code: 'KeyY',        label: 'Y',                row: 1, col: 6,  width: 1,    side: 'right' },
  { code: 'KeyU',        label: 'U',                row: 1, col: 7,  width: 1,    side: 'right' },
  { code: 'KeyI',        label: 'I',                row: 1, col: 8,  width: 1,    side: 'right' },
  { code: 'KeyO',        label: 'O',                row: 1, col: 9,  width: 1,    side: 'right' },
  { code: 'KeyP',        label: 'P',                row: 1, col: 10, width: 1,    side: 'right' },
  { code: 'BracketLeft', label: '[',  label2: '{',  row: 1, col: 11, width: 1,    side: 'right' },
  { code: 'BracketRight',label: ']',  label2: '}',  row: 1, col: 12, width: 1,    side: 'right' },
  { code: 'Backslash',   label: '\\', label2: '|',  row: 1, col: 13, width: 1.5,  side: 'right' },

  // Row 2 — Home row
  { code: 'CapsLock',  label: 'Caps',               row: 2, col: 0,  width: 1.75, side: 'left'  },
  { code: 'KeyA',      label: 'A',                  row: 2, col: 1,  width: 1,    side: 'left'  },
  { code: 'KeyS',      label: 'S',                  row: 2, col: 2,  width: 1,    side: 'left'  },
  { code: 'KeyD',      label: 'D',                  row: 2, col: 3,  width: 1,    side: 'left'  },
  { code: 'KeyF',      label: 'F',                  row: 2, col: 4,  width: 1,    side: 'left'  },
  { code: 'KeyG',      label: 'G',                  row: 2, col: 5,  width: 1,    side: 'left'  },
  { code: 'KeyH',      label: 'H',                  row: 2, col: 6,  width: 1,    side: 'right' },
  { code: 'KeyJ',      label: 'J',                  row: 2, col: 7,  width: 1,    side: 'right' },
  { code: 'KeyK',      label: 'K',                  row: 2, col: 8,  width: 1,    side: 'right' },
  { code: 'KeyL',      label: 'L',                  row: 2, col: 9,  width: 1,    side: 'right' },
  { code: 'Semicolon', label: ';',  label2: ':',    row: 2, col: 10, width: 1,    side: 'right' },
  { code: 'Quote',     label: "'",  label2: '"',    row: 2, col: 11, width: 1,    side: 'right' },
  { code: 'Enter',     label: 'Enter',              row: 2, col: 12, width: 2.25, side: 'right' },

  // Row 3 — ZXCV
  { code: 'ShiftLeft',  label: 'Shift',             row: 3, col: 0,  width: 2.25, side: 'left'  },
  { code: 'KeyZ',       label: 'Z',                 row: 3, col: 1,  width: 1,    side: 'left'  },
  { code: 'KeyX',       label: 'X',                 row: 3, col: 2,  width: 1,    side: 'left'  },
  { code: 'KeyC',       label: 'C',                 row: 3, col: 3,  width: 1,    side: 'left'  },
  { code: 'KeyV',       label: 'V',                 row: 3, col: 4,  width: 1,    side: 'left'  },
  { code: 'KeyB',       label: 'B',                 row: 3, col: 5,  width: 1,    side: 'left'  },
  { code: 'KeyN',       label: 'N',                 row: 3, col: 6,  width: 1,    side: 'right' },
  { code: 'KeyM',       label: 'M',                 row: 3, col: 7,  width: 1,    side: 'right' },
  { code: 'Comma',      label: ',',  label2: '<',   row: 3, col: 8,  width: 1,    side: 'right' },
  { code: 'Period',     label: '.',  label2: '>',   row: 3, col: 9,  width: 1,    side: 'right' },
  { code: 'Slash',      label: '/',  label2: '?',   row: 3, col: 10, width: 1,    side: 'right' },
  { code: 'ShiftRight', label: 'Shift',             row: 3, col: 11, width: 2.75, side: 'right' },

  // Row 4 — Space row (Meta/Win キーは廃止)
  { code: 'ControlLeft',  label: 'Ctrl',            row: 4, col: 0,  width: 1.5,  side: 'left'  },
  { code: 'AltLeft',      label: 'Alt',             row: 4, col: 1,  width: 1.5,  side: 'left'  },
  { code: 'Space',        label: 'Space',           row: 4, col: 2,  width: 7,    side: 'right' },
  { code: 'AltRight',     label: 'Alt',             row: 4, col: 3,  width: 1.5,  side: 'right' },
  { code: 'ControlRight', label: 'Ctrl',            row: 4, col: 4,  width: 1.5,  side: 'right' },
]

export const US_LAYOUT: KeyboardLayout = {
  id: 'us',
  name: 'US (QWERTY)',
  keys,
}
