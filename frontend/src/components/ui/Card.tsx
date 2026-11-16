import type { ReactNode } from 'react'
import styles from './Card.module.css'

interface Props {
  title?: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
  flush?: boolean
}

export default function Card({ title, subtitle, actions, children, className, flush }: Props) {
  return (
    <section className={`${styles.card} ${className ?? ''}`}>
      {(title || actions) && (
        <header className={styles.header}>
          <div>
            {title && <h2 className={styles.title}>{title}</h2>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
      )}
      <div className={flush ? undefined : styles.body}>{children}</div>
    </section>
  )
}
