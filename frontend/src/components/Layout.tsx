import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { projetoService } from '../services/projetoService'
import { TIPO_USUARIO_LABEL } from '../utils/rotulos'
import styles from './Layout.module.css'

function iniciais(nome: string): string {
  return nome.replace(/^Prof\.\s*/, '').split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase()
}

export default function Layout() {
  const { nome, tipoUsuario, logout, idUsuario } = useAuth()
  const navigate = useNavigate()

  const sair = () => {
    logout()
    navigate('/login')
  }

  const podeVerDashboard = tipoUsuario === 'PROFESSOR' || tipoUsuario === 'TUTOR' || tipoUsuario === 'GESTOR'
  const podeVerProjetos = podeVerDashboard || (idUsuario !== null && projetoService.isMembro(idUsuario))
  const isGestor = tipoUsuario === 'GESTOR'

  const link = ({ isActive }: { isActive: boolean }) => `${styles.link} ${isActive ? styles.active : ''}`

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.inner}>
          <NavLink to="/mapa" className={styles.brand} aria-label="SOL, página inicial">
            <img src="/favicon.svg" alt="" className={styles.logo} width={28} height={28} />
            <span className={styles.brandText}>
              <strong>SOL</strong>
              <span>Ocupação de Locais</span>
            </span>
          </NavLink>

          <nav className={styles.nav} aria-label="Principal">
            <NavLink to="/mapa" className={link}>Mapa</NavLink>
            {podeVerDashboard && <NavLink to="/dashboard" className={link}>Solicitações</NavLink>}
            {podeVerProjetos && <NavLink to="/projetos" className={link}>Projetos</NavLink>}
            {isGestor && (
              <>
                <span className={styles.sep} aria-hidden />
                <NavLink to="/admin/usuarios" className={link}>Usuários</NavLink>
                <NavLink to="/admin/salas" className={link}>Salas</NavLink>
                <NavLink to="/admin/disciplinas" className={link}>Disciplinas</NavLink>
              </>
            )}
          </nav>

          <div className={styles.user}>
            <span className={styles.avatar} aria-hidden>{nome ? iniciais(nome) : '?'}</span>
            <span className={styles.userText}>
              <span className={styles.userName}>{nome}</span>
              <span className={styles.userRole}>{tipoUsuario ? TIPO_USUARIO_LABEL[tipoUsuario] : ''}</span>
            </span>
            <button type="button" className={styles.logout} onClick={sair}>Sair</button>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
