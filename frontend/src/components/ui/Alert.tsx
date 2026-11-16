import type { ReactNode } from 'react'
import styles from './Alert.module.css'

interface Props {
  tone?: 'info' | 'ok' | 'warn' | 'danger' | 'neutral'
  title?: string
  children: ReactNode
}

export default function Alert({ tone = 'info', title, children }: Props) {
  const role = tone === 'danger' ? 'alert' : 'status'
  return (
    <div className={`${styles.alert} ${styles[tone]}`} role={role}>
      {title && <strong className={styles.title}>{title}</strong>}
      <div>{children}</div>
    </div>
  )
}
