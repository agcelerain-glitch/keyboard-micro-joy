import { useKeyboard } from '../../hooks/useKeyboard'
import { US_LAYOUT } from '../../data/layouts/us'
import { JIS_LAYOUT } from '../../data/layouts/jis'
import type { KeyboardLayout } from '../../data/layouts/types'
import styles from './OverlayMode.module.css'

const LAYOUTS: KeyboardLayout[] = [US_LAYOUT, JIS_LAYOUT]

interface Props {
  layoutId: 'us' | 'jis'
  onLayoutChange: (id: 'us' | 'jis') => void
}

export default function OverlayMode({ layoutId, onLayoutChange }: Props) {
  const { pressed, pawSide } = useKeyboard()
  const layout = LAYOUTS.find(l => l.id === layoutId) ?? US_LAYOUT

  const pawLabel = pawSide === 'left' ? 'L' : pawSide === 'right' ? 'R' : pawSide === 'both' ? 'LR' : ''

  return (
    <div className={styles.root}>
      <div className={styles.catArea}>
        <div className={`${styles.paw} ${styles.pawLeft} ${pawSide === 'left' || pawSide === 'both' ? styles.active : ''}`} />
        <div className={styles.catBody}>
          {pawLabel && <span className={styles.pawLabel}>{pawLabel}</span>}
        </div>
        <div className={`${styles.paw} ${styles.pawRight} ${pawSide === 'right' || pawSide === 'both' ? styles.active : ''}`} />
      </div>

      <div className={styles.keyRows}>
        {[0, 1, 2, 3, 4].map(row => (
          <div key={row} className={styles.keyRow}>
            {layout.keys
              .filter(k => k.row === row)
              .map(k => (
                <div
                  key={k.code}
                  className={`${styles.key} ${pressed.has(k.code) ? styles.pressed : ''}`}
                  style={{ flexGrow: k.width, flexBasis: `${k.width * 14}px` }}
                  title={k.code}
                >
                  {k.label}
                </div>
              ))}
          </div>
        ))}
      </div>

      <select
        className={styles.layoutSelect}
        value={layoutId}
        onChange={e => onLayoutChange(e.target.value as 'us' | 'jis')}
      >
        {LAYOUTS.map(l => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>
    </div>
  )
}
