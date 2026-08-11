import { useKeyboard } from '../../hooks/useKeyboard'
import { US_LAYOUT } from '../../data/layouts/us'
import { JIS_LAYOUT } from '../../data/layouts/jis'
import type { KeyboardLayout } from '../../data/layouts/types'
import styles from './KeyboardSection.module.css'

const LAYOUTS: KeyboardLayout[] = [US_LAYOUT, JIS_LAYOUT]

// bongo.cat スプライトシート定数 (800×450 × 2frame × 2theme)
const CAT_W = 800
const CAT_H = 450
const SCALE = 0.25 // 表示幅 200px / スプライト幅 800px

interface Props {
  layoutId: 'us' | 'jis'
  onLayoutChange: (id: 'us' | 'jis') => void
}

export default function KeyboardSection({ layoutId, onLayoutChange }: Props) {
  const { pressed, pawSide } = useKeyboard()
  const layout = LAYOUTS.find(l => l.id === layoutId) ?? US_LAYOUT

  // 正規アプリに合わせて左右を逆に割り当て
  const leftDown  = pawSide === 'right' || pawSide === 'both'
  const rightDown = pawSide === 'left'  || pawSide === 'both'

  const displayW = Math.round(CAT_W * SCALE)   // 200
  const displayH = Math.round(CAT_H * SCALE)   // 113

  return (
    <div className={styles.root}>
      {/* ── Cat display ── */}
      <div className={styles.catWrapper} style={{ width: displayW, height: displayH }}>
        <div
          className={styles.catInner}
          style={{ width: CAT_W, height: CAT_H, transform: `scale(${SCALE})` }}
        >
          <div className={`${styles.layer} ${styles.catHead}`} />
          <div className={`${styles.layer} ${styles.catKeyboard}`} />
          <div className={`${styles.layer} ${styles.pawLeft}  ${leftDown  ? styles.down : ''}`} />
          <div className={`${styles.layer} ${styles.pawRight} ${rightDown ? styles.down : ''}`} />
        </div>
      </div>

      {/* ── Key grid ── */}
      <div className={styles.keyRows}>
        {[0, 1, 2, 3, 4].map(row => (
          <div key={row} className={styles.keyRow}>
            {layout.keys
              .filter(k => k.row === row)
              .map(k => (
                <div
                  key={k.code}
                  className={`${styles.key} ${pressed.has(k.code) ? styles.pressed : ''}`}
                  style={{ flexGrow: k.width, flexBasis: `${k.width * 12}px` }}
                >
                  {k.label}
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* ── Layout selector ── */}
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
