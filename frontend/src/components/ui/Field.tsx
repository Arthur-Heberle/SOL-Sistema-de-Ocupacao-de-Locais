import type { ReactNode } from 'react'
import styles from './Field.module.css'

interface Props {
  label: string
  hint?: string
  required?: boolean
  className?: string
  children: ReactNode
}

/** Wraps a form control with a visible label. The control must be the direct child. */
export default function Field({ label, hint, required, className, children }: Props) {
  return (
    <label className={`${styles.field} ${className ?? ''}`}>
      <span className={styles.label}>
        {label}
        {required && <span className={styles.req} aria-hidden> *</span>}
      </span>
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  )
}
