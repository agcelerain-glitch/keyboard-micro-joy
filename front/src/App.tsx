import { useState, useEffect, useCallback } from 'react'
import OverlayMode from './components/OverlayMode/OverlayMode'
import TypingMode from './components/TypingMode/TypingMode'
import styles from './App.module.css'

type Mode = 'overlay' | 'typing'

const TARGET: Record<Mode, number> = { overlay: 200, typing: 500 }

export default function App() {
  const [mode, setMode] = useState<Mode>('overlay')
  const [layoutId, setLayoutId] = useState<'us' | 'jis'>('us')
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight })

  const toggleMode = useCallback(() => {
    setMode(prev => (prev === 'overlay' ? 'typing' : 'overlay'))
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault()
        toggleMode()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleMode])

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const size = TARGET[mode]
  const wMatch = Math.abs(viewport.w - size) <= 2
  const hMatch = Math.abs(viewport.h - size) <= 2

  return (
    <div className={styles.root}>
      <div className={styles.appBox} style={{ width: size, height: size }}>
        {mode === 'overlay'
          ? <OverlayMode layoutId={layoutId} onLayoutChange={setLayoutId} />
          : <TypingMode />}
      </div>

      <button className={styles.toggleBtn} onClick={toggleMode}>
        {mode === 'overlay' ? 'Typing Mode' : 'Overlay Mode'}
        <span className={styles.shortcutHint}>Ctrl+Alt+M</span>
      </button>

      <div className={`${styles.viewportInfo} ${wMatch && hMatch ? styles.matched : ''}`}>
        {viewport.w} &times; {viewport.h}
        <span className={styles.target}> / 目標 {size} &times; {size}</span>
      </div>
    </div>
  )
}
