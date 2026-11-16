import { useState } from 'react'
import { Link } from 'react-router-dom'
import { projetoService } from '../services/projetoService'
import { useAuth } from '../context/AuthContext'
import { CATEGORIA_LABEL } from '../utils/rotulos'
import FormProjetoComponent from '../components/FormProjetoComponent'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import type { ProjetoDTO } from '../types'
import styles from './ProjetosListPage.module.css'

export default function ProjetosListPage() {
  const { idUsuario, tipoUsuario } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [projetos, setProjetos] = useState<ProjetoDTO[]>(() => filtrarProjetos())

  function filtrarProjetos(): ProjetoDTO[] {
    const todos = projetoService.listar()
    if (tipoUsuario === 'GESTOR') return todos
    if (idUsuario == null) return []
    return todos.filter(p =>
      p.idTutor === idUsuario ||
      projetoService.membros(p.id).some(m => m.idUsuario === idUsuario)
    )
  }

  const recarregar = () => setProjetos(filtrarProjetos())
  const podeCriar = tipoUsuario === 'PROFESSOR' || tipoUsuario === 'TUTOR' || tipoUsuario === 'GESTOR'

  return (
    <main>
      <PageHeader
        title="Projetos"
        subtitle="Projetos vinculados à sua conta."
        actions={podeCriar && (
          <Button variant={showForm ? 'secondary' : 'primary'} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancelar' : 'Novo projeto'}
          </Button>
        )}
      />

      {showForm && (
        <Card title="Registrar novo projeto" className={styles.formCard}>
          <FormProjetoComponent onCriado={() => { recarregar(); setShowForm(false) }} />
        </Card>
      )}

      {projetos.length === 0 ? (
        <EmptyState title="Nenhum projeto encontrado para sua conta.">
          {podeCriar && 'Clique em "Novo projeto" para começar.'}
        </EmptyState>
      ) : (
        <div className={styles.grid}>
          {projetos.map(p => (
            <Link key={p.id} to={`/projetos/${p.id}`} className={styles.item}>
              <div className={styles.top}>
                <h2 className={styles.nome}>{p.nome}</h2>
              </div>
              <p className={styles.desc}>{p.descricao}</p>
              <div className={styles.foot}>
                <Badge tone="info">{CATEGORIA_LABEL[p.categoria]}</Badge>
                <Badge tone={p.aprovado ? 'ok' : 'warn'} dot>{p.aprovado ? 'Aprovado' : 'Pendente'}</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
