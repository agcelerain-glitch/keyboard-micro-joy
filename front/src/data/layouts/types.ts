export interface KeyDef {
  code: string
  label: string
  label2?: string
  row: number
  col: number
  width: number
  side: 'left' | 'right'
}

export interface KeyboardLayout {
  id: 'us' | 'jis'
  name: string
  keys: KeyDef[]
}
