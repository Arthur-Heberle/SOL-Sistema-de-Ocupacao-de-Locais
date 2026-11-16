import type { ReactNode } from 'react'
import styles from './Checkbox.module.css'

interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
  label: ReactNode
  description?: string
}

export default function Checkbox({ checked, onChange, label, description }: Props) {
  return (
    <label className={styles.check}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span>
        <span className={styles.label}>{label}</span>
        {description && <span className={styles.desc}>{description}</span>}
      </span>
    </label>
  )
}
