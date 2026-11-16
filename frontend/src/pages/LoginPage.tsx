import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as mockLogin } from '../services/authService'
import Button from '../components/ui/Button'
import Field from '../components/ui/Field'
import Alert from '../components/ui/Alert'
import styles from './LoginPage.module.css'

interface PerfilDemo {
  email: string
  rotulo: string
  descricao: string
  destino: string
}

const PERFIS_DEMO: PerfilDemo[] = [
  { email: 'gestor@utfpr.edu.br', rotulo: 'Gestor', descricao: 'Aprova reservas e administra cadastros', destino: '/dashboard' },
  { email: 'ana@utfpr.edu.br', rotulo: 'Professor', descricao: 'Reserva salas e registra projetos', destino: '/mapa' },
  { email: 'carlos@utfpr.edu.br', rotulo: 'Tutor', descricao: 'Gerencia a sala do PET Computação', destino: '/mapa' },
  { email: 'maria@utfpr.edu.br', rotulo: 'Aluna membro', descricao: 'Integrante do PET Computação', destino: '/projetos' },
  { email: 'joao@utfpr.edu.br', rotulo: 'Aluno', descricao: 'Apenas consulta a ocupação', destino: '/mapa' },
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  const autenticar = (emailLogin: string, senhaLogin: string, destino?: string) => {
    const r = mockLogin(emailLogin, senhaLogin)
    if (!r.ok) { setErro(r.erro ?? 'Erro ao fazer login.'); return }
    login(r.token!, r.nome!, r.tipoUsuario!, r.idUsuario!)
    navigate(destino ?? (r.tipoUsuario === 'GESTOR' ? '/dashboard' : '/mapa'))
  }

  const entrar = (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    autenticar(email, senha)
  }

  return (
    <div className={styles.page}>
      <aside className={styles.hero}>
        <div className={styles.heroBrand}>
          <img src="/favicon.svg" alt="" width={40} height={40} />
          <span>SOL</span>
        </div>
        <div>
          <h1 className={styles.heroTitle}>Encontre e reserve salas do campus em poucos cliques.</h1>
          <p className={styles.heroText}>
            Consulte a ocupação em tempo real, solicite reservas pontuais ou semestrais e
            coordene horários do seu projeto, tudo em um só lugar.
          </p>
        </div>
        <p className={styles.heroFoot}>UTFPR Campus Curitiba, Sede Centro</p>
      </aside>

      <section className={styles.panel}>
        <div className={styles.formWrap}>
          <h2 className={styles.title}>Entrar</h2>
          <p className={styles.subtitle}>Use seu e-mail institucional.</p>

          <form onSubmit={entrar} className={styles.form}>
            <Field label="E-mail institucional">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@utfpr.edu.br"
                autoComplete="username"
                required
              />
            </Field>
            <Field label="Senha">
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                autoComplete="current-password"
                required
              />
            </Field>
            {erro && <Alert tone="danger">{erro}</Alert>}
            <Button type="submit" block>Entrar</Button>
          </form>

          <div className={styles.demo}>
            <div className={styles.demoHead}>
              <span>Acesso rápido de demonstração</span>
              <span className={styles.demoHint}>senha 123456</span>
            </div>
            <ul className={styles.demoList}>
              {PERFIS_DEMO.map(p => (
                <li key={p.email}>
                  <button type="button" className={styles.demoItem} onClick={() => autenticar(p.email, '123456', p.destino)}>
                    <span className={styles.demoRole}>{p.rotulo}</span>
                    <span className={styles.demoDesc}>{p.descricao}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
