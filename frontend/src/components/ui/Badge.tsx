import type { ReactNode } from 'react'
import styles from './Badge.module.css'

export type BadgeTone = 'neutral' | 'ok' | 'warn' | 'danger' | 'info' | 'accent'

interface Props {
  tone?: BadgeTone
  children: ReactNode
  dot?: boolean
}

export default function Badge({ tone = 'neutral', children, dot = false }: Props) {
  return (
    <span className={`${styles.badge} ${styles[tone]}`}>
      {dot && <span className={styles.dot} aria-hidden />}
      {children}
    </span>
  )
}
