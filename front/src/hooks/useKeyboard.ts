import { useEffect, useReducer } from 'react'

export type PawSide = 'left' | 'right' | 'both' | null

export interface KeyboardState {
  pressed: ReadonlySet<string>
  pawSide: PawSide
}

type Action =
  | { type: 'down'; code: string }
  | { type: 'up'; code: string }

const LEFT_CODES = new Set([
  'Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5',
  'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT',
  'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG',
  'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB',
  'ControlLeft', 'MetaLeft', 'AltLeft',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6',
  'Escape',
])

function getSide(codes: Set<string>): PawSide {
  if (codes.size === 0) return null
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
  const next = new Set(state.pressed)
  if (action.type === 'down') next.add(action.code)
  else next.delete(action.code)
  return { pressed: next, pawSide: getSide(next) }
}

const INITIAL: KeyboardState = { pressed: new Set(), pawSide: null }

export function useKeyboard(): KeyboardState {
  const [state, dispatch] = useReducer(reducer, INITIAL)

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => dispatch({ type: 'down', code: e.code })
    const onUp = (e: KeyboardEvent) => dispatch({ type: 'up', code: e.code })
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [])

  return state
}
