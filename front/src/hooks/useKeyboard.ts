import { useEffect, useReducer } from 'react'

export type PawSide = 'left' | 'right' | 'both' | null

export interface KeyboardState {
  pressed: ReadonlySet<string>
  pawSide: PawSide
}

type Action =
  | { type: 'down'; code: string }
  | { type: 'up'; code: string }
  | { type: 'clear' }

// Space は常に両手演出
const BOTH_CODES = new Set(['Space'])

// Meta (Win/Cmd) キーはOS干渉でkeyupが来ないため廃止
const LEFT_CODES = new Set([
  'Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5',
  'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT',
  'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG',
  'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB',
  'ControlLeft', 'AltLeft',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6',
  'Escape',
])

function getSide(codes: Set<string>): PawSide {
  if (codes.size === 0) return null
  for (const code of codes) {
    if (BOTH_CODES.has(code)) return 'both'
  }
  let hasLeft = false
  let hasRight = false
  for (const code of codes) {
    if (LEFT_CODES.has(code)) hasLeft = true
    else hasRight = true
  }
  if (hasLeft && hasRight) return 'both'
  return hasLeft ? 'left' : 'right'
}

function reducer(state: KeyboardState, action: Action): KeyboardState {
  if (action.type === 'clear') {
    return { pressed: new Set(), pawSide: null }
  }
  const next = new Set(state.pressed)
  if (action.type === 'down') next.add(action.code)
  else next.delete(action.code)
  return { pressed: next, pawSide: getSide(next) }
}

const INITIAL: KeyboardState = { pressed: new Set(), pawSide: null }

const IS_TAURI = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

export function useKeyboard(): KeyboardState {
  const [state, dispatch] = useReducer(reducer, INITIAL)

  useEffect(() => {
    // DOM イベント（フォーカス中に確実に反応）
    const onDown = (e: KeyboardEvent) => dispatch({ type: 'down', code: e.code })
    const onUp   = (e: KeyboardEvent) => dispatch({ type: 'up',   code: e.code })
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup',   onUp)

    if (!IS_TAURI) {
      // ブラウザ版: フォーカス喪失時にキー状態をリセット
      const onBlur = () => dispatch({ type: 'clear' })
      window.addEventListener('blur', onBlur)
      return () => {
        window.removeEventListener('keydown', onDown)
        window.removeEventListener('keyup',   onUp)
        window.removeEventListener('blur',    onBlur)
      }
    }

    // Tauri 版: rdev グローバルイベントを追加で購読（非フォーカス時に反応）
    // DOM と rdev が同時に発火しても Set は冪等なので二重反応は起きない
    let unlisten: (() => void) | undefined
    import('@tauri-apps/api/event')
      .then(({ listen }) =>
        listen<{ code: string; pressed: boolean }>('global_key', ({ payload }) => {
          dispatch({ type: payload.pressed ? 'down' : 'up', code: payload.code })
        })
      )
      .then(fn => { unlisten = fn })

    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup',   onUp)
      unlisten?.()
    }
  }, [])

  return state
}
