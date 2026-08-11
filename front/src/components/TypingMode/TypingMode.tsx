import { useState, useEffect, useCallback, useRef } from 'react'
import KeyboardSection from '../KeyboardSection/KeyboardSection'
import styles from './TypingMode.module.css'

interface QuestionsData {
  questions: string[]
}

function pickRandom(arr: string[], exclude?: string): string {
  const filtered = arr.length > 1 ? arr.filter(q => q !== exclude) : arr
  return filtered[Math.floor(Math.random() * filtered.length)]
}

interface Props {
  layoutId: 'us' | 'jis'
  onLayoutChange: (id: 'us' | 'jis') => void
}

export default function TypingMode({ layoutId, onLayoutChange }: Props) {
  const [questions, setQuestions] = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [progress, setProgress] = useState(0)
  const currentRef = useRef(current)
  const progressRef = useRef(progress)

  useEffect(() => { currentRef.current = current }, [current])
  useEffect(() => { progressRef.current = progress }, [progress])

  useEffect(() => {
    fetch('/data/questions.json')
      .then(r => r.json())
      .then((data: QuestionsData) => {
        setQuestions(data.questions)
        setCurrent(pickRandom(data.questions))
        setProgress(0)
      })
  }, [])

  const nextQuestion = useCallback((qs: string[], prev: string) => {
    const next = pickRandom(qs, prev)
    setCurrent(next)
    setProgress(0)
  }, [])

  useEffect(() => {
    if (questions.length === 0) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return

      const q = currentRef.current
      const p = progressRef.current

      if (e.key === 'Enter') {
        nextQuestion(questions, q)
        return
      }

      if (p < q.length && e.key === q[p]) {
        const next = p + 1
        setProgress(next)
        if (next >= q.length) {
          setTimeout(() => nextQuestion(questions, q), 300)
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [questions, nextQuestion])

  const typed = current.slice(0, progress)
  const remaining = current.slice(progress)

  return (
    <div className={styles.root}>
      {/* ── Typing area ── */}
      <div className={styles.typingArea}>
        {questions.length === 0 ? (
          <p className={styles.loading}>Loading...</p>
        ) : (
          <>
            <div className={styles.question}>
              <span className={styles.typed}>{typed}</span>
              <span className={styles.cursor} />
              <span className={styles.remaining}>{remaining}</span>
            </div>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressBar}
                style={{ width: `${current.length > 0 ? (progress / current.length) * 100 : 0}%` }}
              />
            </div>
            <p className={styles.hint}>Enter でスキップ</p>
          </>
        )}
      </div>

      {/* ── Keyboard section (same design as overlay mode) ── */}
      <div className={styles.keyboardWrapper}>
        <KeyboardSection layoutId={layoutId} onLayoutChange={onLayoutChange} />
      </div>
    </div>
  )
}
