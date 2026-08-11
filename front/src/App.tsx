import { useState, useEffect, useCallback, useRef } from 'react'
import OverlayMode from './components/OverlayMode/OverlayMode'
import TypingMode from './components/TypingMode/TypingMode'
import styles from './App.module.css'

type Mode = 'overlay' | 'typing'

const IS_TAURI = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

// コンテンツボックスのサイズ
const BOX: Record<Mode, { w: number; h: number }> = {
  overlay: { w: 200, h: 200 },
  typing:  { w: 500, h: 500 },
}

// Tauri ウィンドウのサイズ（タイトルバー24 + パディング + ボタン分を加算）
const TAURI_WIN: Record<Mode, { w: number; h: number }> = {
  overlay: { w: 240, h: 296 },
  typing:  { w: 540, h: 606 },
}

export default function App() {
  const [mode, setMode]       = useState<Mode>('overlay')
  const [layoutId, setLayout] = useState<'us' | 'jis'>('us')
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight })
  const titleBarRef = useRef<HTMLDivElement>(null)

  // Tauri: body を透過モードに設定
  useEffect(() => {
    if (IS_TAURI) document.body.classList.add('tauri-mode')
  }, [])

  // Tauri: タイトルバードラッグ（data-tauri-drag-region だけでは v2 で動かないため明示呼び出し）
  useEffect(() => {
    if (!IS_TAURI) return
    const el = titleBarRef.current
    if (!el) return
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      import('@tauri-apps/api/window').then(({ getCurrentWindow }) => {
        getCurrentWindow().startDragging()
      })
    }
    el.addEventListener('mousedown', onMouseDown)
    return () => el.removeEventListener('mousedown', onMouseDown)
  }, [])

  // Tauri: × ボタン → ウィンドウをトレイに隠す
  const handleHide = useCallback(() => {
    import('@tauri-apps/api/window').then(({ getCurrentWindow }) => {
      getCurrentWindow().hide()
    })
  }, [])

  const toggleMode = useCallback(() => {
    setMode(prev => (prev === 'overlay' ? 'typing' : 'overlay'))
  }, [])

  // Tauri: モード切替時にウィンドウを自動リサイズ
  useEffect(() => {
    if (!IS_TAURI) return
    const { w, h } = TAURI_WIN[mode]
    import('@tauri-apps/api/window').then(({ getCurrentWindow, LogicalSize }) => {
      getCurrentWindow().setSize(new LogicalSize(w, h))
    })
  }, [mode])

  // Ctrl+Alt+M でモード切替
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

  // Web 版: Viewport サイズ監視
  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const { w, h } = BOX[mode]
  const matched = Math.abs(viewport.w - w) <= 2 && Math.abs(viewport.h - h) <= 2

  return (
    <div className={styles.root} style={IS_TAURI ? { background: 'transparent' } : {}}>

      {/* タイトルバー: ドラッグ移動 + トレイ格納ボタン */}
      <div ref={titleBarRef} className={styles.titleBar} data-tauri-drag-region>
        <span className={styles.grip}>⠿</span>
        <span className={styles.titleText}>keyboard-micro-joy</span>
        {IS_TAURI && (
          <button
            className={styles.closeBtn}
            onClick={handleHide}
            title="トレイに格納"
          >
            ×
          </button>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.appBox} style={{ width: w, height: h }}>
          {mode === 'overlay'
            ? <OverlayMode layoutId={layoutId} onLayoutChange={setLayout} />
            : <TypingMode  layoutId={layoutId} onLayoutChange={setLayout} />}
        </div>

        <button className={styles.toggleBtn} onClick={toggleMode}>
          {mode === 'overlay' ? 'Typing Mode' : 'Overlay Mode'}
          <span className={styles.shortcutHint}>Ctrl+Alt+M</span>
        </button>
      </div>

      {/* Web 版のみ: ウィンドウサイズインジケーター */}
      {!IS_TAURI && (
        <div className={`${styles.viewportInfo} ${matched ? styles.matched : ''}`}>
          {viewport.w} &times; {viewport.h}
          <span className={styles.target}> / {w} &times; {h}</span>
        </div>
      )}
    </div>
  )
}
