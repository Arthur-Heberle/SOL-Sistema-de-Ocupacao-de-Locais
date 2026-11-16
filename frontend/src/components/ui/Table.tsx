import type { ReactNode } from 'react'
import styles from './Table.module.css'

/** Styled, horizontally scrollable table. Use `data-align="center"` on th/td to center cells. */
export default function Table({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        {caption && <caption className="visually-hidden">{caption}</caption>}
        {children}
      </table>
    </div>
  )
}
