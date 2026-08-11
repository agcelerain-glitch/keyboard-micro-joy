import KeyboardSection from '../KeyboardSection/KeyboardSection'
import styles from './OverlayMode.module.css'

interface Props {
  layoutId: 'us' | 'jis'
  onLayoutChange: (id: 'us' | 'jis') => void
}

export default function OverlayMode({ layoutId, onLayoutChange }: Props) {
  return (
    <div className={styles.root}>
      <KeyboardSection layoutId={layoutId} onLayoutChange={onLayoutChange} />
    </div>
  )
}
