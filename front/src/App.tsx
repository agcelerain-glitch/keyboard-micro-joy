import { useState, useEffect, useCallback } from 'react'
import OverlayMode from './components/OverlayMode/OverlayMode'
import TypingMode from './components/TypingMode/TypingMode'
import styles from './App.module.css'

type Mode = 'overlay' | 'typing'

const TARGET: Record<Mode, { w: number; h: number }> = {
  overlay: { w: 200, h: 200 },
  typing:  { w: 500, h: 500 },
}

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

  const { w, h } = TARGET[mode]
  const matched = Math.abs(viewport.w - w) <= 2 && Math.abs(viewport.h - h) <= 2

  return (
    <div className={styles.root}>
      <div className={styles.appBox} style={{ width: w, height: h }}>
        {mode === 'overlay'
          ? <OverlayMode layoutId={layoutId} onLayoutChange={setLayoutId} />
          : <TypingMode layoutId={layoutId} onLayoutChange={setLayoutId} />}
      </div>

      <button className={styles.toggleBtn} onClick={toggleMode}>
        {mode === 'overlay' ? 'Typing Mode' : 'Overlay Mode'}
        <span className={styles.shortcutHint}>Ctrl+Alt+M</span>
      </button>

      <div className={`${styles.viewportInfo} ${matched ? styles.matched : ''}`}>
        {viewport.w} &times; {viewport.h}
        <span className={styles.target}> / {w} &times; {h}</span>
      </div>
    </div>
  )
}
