import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type Size = 'sm' | 'md'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  block?: boolean
}

export default function Button({
  variant = 'primary', size = 'md', block = false, className, type = 'button', ...rest
}: Props) {
  const cls = [styles.btn, styles[variant], styles[size], block && styles.block, className]
    .filter(Boolean).join(' ')
  return <button type={type} className={cls} {...rest} />
}
