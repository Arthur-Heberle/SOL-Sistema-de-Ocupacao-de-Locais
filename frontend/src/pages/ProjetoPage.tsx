import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { projetoService } from '../services/projetoService'
import { reservaService } from '../services/reservaService'
import { salaService } from '../services/salaService'
import { useAuth } from '../context/AuthContext'
import { CATEGORIA_LABEL } from '../utils/rotulos'
import HorariosLivresComponent from '../components/HorariosLivresComponent'
import MembrosListComponent from '../components/MembrosListComponent'
import CalendarioComponent from '../components/CalendarioComponent'
import ModalReservaComponent from '../components/ModalReservaComponent'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import EmptyState from '../components/ui/EmptyState'
import styles from './ProjetoPage.module.css'

export default function ProjetoPage() {
  const { id } = useParams()
  const { tipoUsuario, idUsuario } = useAuth()
  const idNum = Number(id)
  const projeto = projetoService.buscarPorId(idNum)

  const [aprovado, setAprovado] = useState(projeto?.aprovado ?? false)
  const [modalAberto, setModalAberto] = useState(false)
  const [versao, setVersao] = useState(0)

  if (!projeto) {
    return (
      <EmptyState title="Projeto não encontrado">
        <Link to="/projetos">Voltar para Projetos</Link>
      </EmptyState>
    )
  }

  const isGestor = tipoUsuario === 'GESTOR'
  const membros = projetoService.membros(idNum)
  const isMembroOuGestor = isGestor || (idUsuario !== null && membros.some(m => m.idUsuario === idUsuario))
  const sala = projeto.idSalaExclusiva ? salaService.buscarPorId(projeto.idSalaExclusiva) ?? null : null

  void versao // re-read reservations after creating one
  const reservasDaSala = sala
    ? reservaService.reservasDaSala(sala.id).filter(r => isMembroOuGestor || r.visibilidade === 'PUBLICA')
    : []

  const aprovar = () => {
    projetoService.aprovar(idNum)
    setAprovado(true)
  }

  return (
    <>
      <PageHeader
        eyebrow={<Link to="/projetos" className={styles.voltar}>Projetos</Link>}
        title={
          <span className={styles.titulo}>
            {projeto.nome}
            <Badge tone="accent">{CATEGORIA_LABEL[projeto.categoria]}</Badge>
            {aprovado ? <Badge tone="ok" dot>Aprovado</Badge> : <Badge tone="warn" dot>Aguardando aprovação</Badge>}
          </span>
        }
        subtitle={projeto.descricao}
        actions={isGestor && !aprovado && <Button variant="success" onClick={aprovar}>Aprovar projeto</Button>}
      />

      <div className={styles.stack}>
        {!aprovado && (
          <Alert tone="warn">
            Este projeto aguarda aprovação do Gestor de Salas. A sala exclusiva e o agendamento de atividades ficam
            disponíveis após a aprovação.
          </Alert>
        )}

        <Card
          title="Disponibilidade dos integrantes"
          subtitle="Marque seus horários livres e encontre o melhor momento para reunir o grupo."
        >
          {isMembroOuGestor ? (
            <HorariosLivresComponent idProjeto={projeto.id} />
          ) : (
            <p className={styles.muted}>Apenas integrantes e o Gestor podem visualizar e editar os horários livres.</p>
          )}
        </Card>

        {sala && aprovado && (
          <Card
            title={`Sala exclusiva ${sala.codigoNome}`}
            subtitle={`${sala.capacidade} lugares${sala.possuiProjetor ? ', com projetor' : ''}${isMembroOuGestor ? '' : '. Exibindo apenas atividades públicas.'}`}
            actions={isMembroOuGestor && <Button onClick={() => setModalAberto(true)}>Agendar atividade</Button>}
          >
            <CalendarioComponent reservas={reservasDaSala} salas={[sala]} />
          </Card>
        )}

        <Card title="Integrantes" subtitle={`${membros.length} ${membros.length === 1 ? 'pessoa' : 'pessoas'}`}>
          <MembrosListComponent idProjeto={projeto.id} />
        </Card>
      </div>

      {sala && modalAberto && (
        <ModalReservaComponent
          sala={sala}
          onFechar={() => setModalAberto(false)}
          onCriada={() => setVersao(v => v + 1)}
        />
      )}
    </>
  )
}
