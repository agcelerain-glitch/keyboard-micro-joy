import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import KeyboardSection from '../KeyboardSection/KeyboardSection'
import styles from './TypingMode.module.css'

type Lang = 'en' | 'ja'
type LangFilter = 'all' | 'en'

interface Question {
  typeStr: string   // タイプする文字列 (日本語の場合はローマ字)
  display: string   // 表示文字列 (日本語の場合は漢字/かな)
  lang: Lang
}

function parseQuestions(text: string): Question[] {
  const result: Question[] = []
  let currentLang: Lang = 'en'

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue

    if (line.startsWith('#')) {
      const m = line.match(/^#\s*\[lang:(\w+)\]/)
      if (m && (m[1] === 'en' || m[1] === 'ja')) currentLang = m[1] as Lang
      continue
    }

    const pipeIdx = line.indexOf('|')
    if (pipeIdx >= 0) {
      const typeStr = line.slice(0, pipeIdx).trim()
      const display = line.slice(pipeIdx + 1).trim()
      if (typeStr) result.push({ typeStr, display, lang: currentLang })
    } else {
      result.push({ typeStr: line, display: line, lang: currentLang })
    }
  }

  return result
}

function pickRandom(arr: Question[], exclude?: Question): Question {
  const filtered = arr.length > 1 ? arr.filter(q => q !== exclude) : arr
  return filtered[Math.floor(Math.random() * filtered.length)]
}

interface Props {
  layoutId: 'us' | 'jis'
  onLayoutChange: (id: 'us' | 'jis') => void
}

export default function TypingMode({ layoutId, onLayoutChange }: Props) {
  const [allQuestions, setAllQuestions] = useState<Question[]>([])
  const [langFilter, setLangFilter]     = useState<LangFilter>('all')
  const [current, setCurrent]           = useState<Question | null>(null)
  const [progress, setProgress]         = useState(0)

  const currentRef  = useRef<Question | null>(null)
  const progressRef = useRef(0)
  const poolRef     = useRef<Question[]>([])

  useEffect(() => { currentRef.current  = current  }, [current])
  useEffect(() => { progressRef.current = progress }, [progress])

  const pool = useMemo(() => {
    if (langFilter === 'en') return allQuestions.filter(q => q.lang === 'en')
    return allQuestions
  }, [allQuestions, langFilter])

  useEffect(() => { poolRef.current = pool }, [pool])

  useEffect(() => {
    fetch('/data/questions.txt')
      .then(r => r.text())
      .then(text => setAllQuestions(parseQuestions(text)))
  }, [])

  useEffect(() => {
    if (pool.length === 0) return
    const cur = currentRef.current
    if (!cur || !pool.includes(cur)) {
      setCurrent(pickRandom(pool))
      setProgress(0)
    }
  }, [pool])

  const nextQuestion = useCallback((prev: Question | null) => {
    const p = poolRef.current
    if (p.length === 0) return
    setCurrent(pickRandom(p, prev ?? undefined))
    setProgress(0)
  }, [])

  useEffect(() => {
    if (pool.length === 0) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return

      const q = currentRef.current
      const p = progressRef.current
      if (!q) return

      if (e.key === 'Enter') {
        nextQuestion(q)
        return
      }

      if (p < q.typeStr.length && e.key === q.typeStr[p]) {
        const next = p + 1
        setProgress(next)
        if (next >= q.typeStr.length) {
          setTimeout(() => nextQuestion(q), 300)
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [pool, nextQuestion])

  const isJapanese = current !== null && current.display !== current.typeStr
  const pct = current && current.typeStr.length > 0
    ? (progress / current.typeStr.length) * 100
    : 0

  return (
    <div className={styles.root}>
      {/* ── 言語フィルターボタン ── */}
      <div className={styles.filterBar}>
        <button
          className={`${styles.filterBtn} ${langFilter === 'all' ? styles.filterBtnActive : ''}`}
          onClick={() => setLangFilter('all')}
        >
          すべて
        </button>
        <button
          className={`${styles.filterBtn} ${langFilter === 'en' ? styles.filterBtnActive : ''}`}
          onClick={() => setLangFilter('en')}
        >
          英語のみ
        </button>
      </div>

      {/* ── タイピングエリア ── */}
      <div className={styles.typingArea}>
        {allQuestions.length === 0 ? (
          <p className={styles.loading}>Loading...</p>
        ) : pool.length === 0 ? (
          <p className={styles.loading}>問題がありません</p>
        ) : current === null ? (
          <p className={styles.loading}>Loading...</p>
        ) : (
          <>
            {/* ローマ字行 + 日本語参照行 */}
            <div className={`${styles.questionWrap} ${isJapanese ? styles.questionWrapJa : ''}`}>
              <div className={styles.question}>
                <span className={styles.typed}>{current.typeStr.slice(0, progress)}</span>
                <span className={styles.cursor} />
                <span className={styles.remaining}>{current.typeStr.slice(progress)}</span>
              </div>
              {isJapanese && (
                <div className={styles.jpRef}>{current.display}</div>
              )}
            </div>

            <div className={styles.progressTrack}>
              <div className={styles.progressBar} style={{ width: `${pct}%` }} />
            </div>
            <p className={styles.hint}>Enter でスキップ</p>
          </>
        )}
      </div>

      {/* ── キーボードセクション ── */}
      <div className={styles.keyboardWrapper}>
        <KeyboardSection layoutId={layoutId} onLayoutChange={onLayoutChange} />
      </div>
    </div>
  )
}
