import { useState } from 'react'
import type { SalaDTO, Visibilidade } from '../types'
import { useAuth } from '../context/AuthContext'
import { reservaService } from '../services/reservaService'
import { usuarioService } from '../services/usuarioService'
import { projetoService } from '../services/projetoService'

interface Props {
  sala: SalaDTO
  aberto: boolean
  onFechar: () => void
  onCriada: () => void
}

export default function ModalReservaComponent({ sala, aberto, onFechar, onCriada }: Props) {
  const { nome, idUsuario } = useAuth()
  const hoje = new Date().toISOString().split('T')[0]
  const [titulo, setTitulo] = useState('')
  const [visibilidade, setVisibilidade] = useState<Visibilidade>('PUBLICA')
  const [dataInicio, setDataInicio] = useState(`${hoje}T08:00`)
  const [dataFim, setDataFim] = useState(`${hoje}T10:00`)
  const [recorrente, setRecorrente] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  if (!aberto) return null

  const isMembroDoProjeto = sala.tipoSala === 'PROJETO' && !!idUsuario &&
    projetoService.isMembroDaSala(idUsuario, sala.id)

  const precisaAprovacao = (sala.tipoSala === 'PROJETO' && !isMembroDoProjeto) || recorrente

  const confirmar = () => {
    setErro('')
    if (!titulo.trim()) { setErro('Informe um título.'); return }
    if (dataFim <= dataInicio) { setErro('Horário de fim deve ser após o início.'); return }
    const usuario = usuarioService.listar().find(u => u.nome === nome)
    try {
      reservaService.criar({
        idSala: sala.id,
        idUsuario: usuario?.id ?? 0,
        titulo: titulo.trim(),
        visibilidade,
        dataInicio,
        dataFim,
        recorrente,
      })
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao criar reserva.')
      return
    }
    setSucesso(precisaAprovacao ? 'Solicitação enviada! Aguardando aprovação do Gestor.' : 'Sala reservada com sucesso!')
    setTimeout(() => { setSucesso(''); onCriada(); onFechar() }, 1800)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#fff', borderRadius: 8, padding: 24, minWidth: 360, maxWidth: 480, width: '90%' }}>
        <h2 style={{ marginBottom: 4 }}>Reservar {sala.codigoNome}</h2>
        <p style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
          {sala.tipoSala} · Cap. {sala.capacidade}{sala.possuiProjetor ? ' · Projetor ✓' : ''}
        </p>
        {precisaAprovacao && (
          <div style={{ background: '#fff3cd', border: '1px solid #f0ad4e', padding: '8px 12px', borderRadius: 4, marginBottom: 12, fontSize: 13 }}>
            ⚠️ {sala.tipoSala === 'PROJETO' && !isMembroDoProjeto
              ? 'Sala de projeto — reserva ficará pendente até aprovação do Gestor.'
              : 'Reserva semestral (recorrente) — ficará pendente até aprovação do Gestor.'}
          </div>
        )}
        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 13 }}>Título<br />
            <input value={titulo} onChange={e => setTitulo(e.target.value)} style={{ width: '100%', padding: 7 }} placeholder="Ex: Aula de Cálculo" />
          </label>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <label style={{ fontSize: 13, flex: 1 }}>Início<br />
            <input type="datetime-local" value={dataInicio} onChange={e => setDataInicio(e.target.value)} style={{ width: '100%', padding: 7 }} />
          </label>
          <label style={{ fontSize: 13, flex: 1 }}>Fim<br />
            <input type="datetime-local" value={dataFim} onChange={e => setDataFim(e.target.value)} style={{ width: '100%', padding: 7 }} />
          </label>
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 10, fontSize: 13 }}>
          <label>
            Visibilidade:<br />
            <select value={visibilidade} onChange={e => setVisibilidade(e.target.value as Visibilidade)} style={{ padding: '6px 8px' }}>
              <option value="PUBLICA">Pública</option>
              <option value="PRIVADA">Privada</option>
            </select>
          </label>
          <label style={{ display: 'flex', alignItems: 'flex-end', gap: 6, paddingBottom: 4 }}>
            <input type="checkbox" checked={recorrente} onChange={e => setRecorrente(e.target.checked)} />
            Recorrente (semanal)
          </label>
        </div>
        {erro && <p style={{ color: '#d9534f', fontSize: 13, marginBottom: 8 }}>{erro}</p>}
        {sucesso && <p style={{ color: '#5cb85c', fontSize: 13, marginBottom: 8 }}>{sucesso}</p>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
          <button onClick={onFechar} style={{ padding: '8px 16px', cursor: 'pointer' }}>Cancelar</button>
          <button onClick={confirmar} style={{ padding: '8px 20px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            {precisaAprovacao ? 'Solicitar' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}
