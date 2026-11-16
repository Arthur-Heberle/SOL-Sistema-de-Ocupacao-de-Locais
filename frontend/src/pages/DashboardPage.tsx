import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ReservaDTO, ProjetoDTO } from '../types'
import { reservaService } from '../services/reservaService'
import { projetoService } from '../services/projetoService'
import { useAuth } from '../context/AuthContext'
import { CATEGORIA_LABEL } from '../utils/rotulos'
import CardSolicitacaoComponent from '../components/CardSolicitacaoComponent'
import PageHeader from '../components/ui/PageHeader'
import Alert from '../components/ui/Alert'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  const { tipoUsuario, idUsuario } = useAuth()
  const isGestor = tipoUsuario === 'GESTOR'

  const [pendentes, setPendentes] = useState<ReservaDTO[]>(() => {
    const todas = reservaService.pendentes()
    return isGestor ? todas : todas.filter(r => r.idUsuario === idUsuario)
  })

  const [projetosPendentes] = useState<ProjetoDTO[]>(() => {
    const todos = projetoService.listar().filter(p => !p.aprovado)
    return isGestor ? todos : todos.filter(p => p.idTutor === idUsuario)
  })

  const aprovar = (id: number) => {
    reservaService.aprovar(id)
    setPendentes(reservaService.pendentes().filter(r => isGestor || r.idUsuario === idUsuario))
  }

  const rejeitar = (id: number) => {
    reservaService.rejeitar(id)
    setPendentes(reservaService.pendentes().filter(r => isGestor || r.idUsuario === idUsuario))
  }

  return (
    <main>
      <PageHeader
        title={isGestor ? 'Solicitações pendentes' : 'Minhas solicitações'}
        subtitle={isGestor
          ? 'Reservas e projetos aguardando aprovação do Gestor de Salas.'
          : 'Acompanhe o status das suas reservas e projetos enviados para aprovação.'}
      />

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{pendentes.length}</span>
          <span className={styles.statLabel}>Reservas pendentes</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{projetosPendentes.length}</span>
          <span className={styles.statLabel}>Projetos pendentes</span>
        </div>
      </div>

      {projetosPendentes.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {isGestor ? 'Projetos pendentes' : 'Meus projetos aguardando aprovação'}
          </h2>
          <div className={styles.list}>
            {projetosPendentes.map(p => (
              <Link key={p.id} to={`/projetos/${p.id}`} className={styles.row}>
                <div>
                  <div className={styles.rowNome}>{p.nome}</div>
                  <div className={styles.rowDesc}>
                    {CATEGORIA_LABEL[p.categoria]} · {p.descricao.slice(0, 70)}{p.descricao.length > 70 ? '…' : ''}
                  </div>
                </div>
                <span className={styles.rowAction}>{isGestor ? 'Revisar' : 'Ver detalhes'}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className={styles.sectionTitle}>
          {isGestor ? 'Reservas pendentes' : 'Minhas reservas pendentes'}
        </h2>
        {pendentes.length === 0 ? (
          <Alert tone="ok">
            {isGestor
              ? 'Nenhuma solicitação de reserva pendente no momento.'
              : 'Você não tem reservas aguardando aprovação no momento.'}
          </Alert>
        ) : (
          <div className={styles.grid}>
            {pendentes.map(r => (
              <CardSolicitacaoComponent
                key={r.id}
                reserva={r}
                onAprovar={isGestor ? aprovar : undefined}
                onRejeitar={isGestor ? rejeitar : undefined}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
