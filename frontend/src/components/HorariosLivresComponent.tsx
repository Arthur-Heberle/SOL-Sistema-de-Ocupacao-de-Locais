import { useState, useEffect, useMemo } from 'react'
import { disponibilidadeService } from '../services/disponibilidadeService'
import { projetoService } from '../services/projetoService'
import { useAuth } from '../context/AuthContext'
import type { HorarioDTO } from '../types'

interface Props {
  idProjeto: number
}

const DIAS = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA']
const DIAS_LABEL = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
const HORAS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']

function slotBg(count: number, total: number): string {
  if (total === 0 || count === 0) return '#f5f5f5'
  const r = count / total
  if (r >= 1.0) return '#1a7a3a'
  if (r >= 0.75) return '#4caf50'
  if (r >= 0.5) return '#8bc34a'
  if (r >= 0.25) return '#cddc39'
  return '#f9fbe7'
}

function slotFg(count: number, total: number): string {
  if (total === 0 || count === 0) return '#bbb'
  return count / total >= 0.5 ? '#fff' : '#555'
}

const cellBase: React.CSSProperties = {
  border: '1px solid #ddd',
  padding: '5px 0',
  textAlign: 'center',
  minWidth: 72,
  fontSize: 11,
}

export default function HorariosLivresComponent({ idProjeto }: Props) {
  const { idUsuario } = useAuth()
  const membros = projetoService.membros(idProjeto)

  // ── My availability ──────────────────────────────────────
  const [meusSlotsStr, setMeusSlotsStr] = useState<Set<string>>(new Set())
  const [salvo, setSalvo] = useState(false)

  useEffect(() => {
    if (!idUsuario) return
    const horarios = disponibilidadeService.carregar(idUsuario, idProjeto)
    setMeusSlotsStr(new Set(horarios.map(h => `${h.diaSemana}|${h.horaInicio}`)))
  }, [idProjeto, idUsuario])

  const toggleMeuSlot = (dia: string, hora: string) => {
    const key = `${dia}|${hora}`
    setMeusSlotsStr(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const salvar = () => {
    if (!idUsuario) return
    const horarios: HorarioDTO[] = Array.from(meusSlotsStr).map(key => {
      const [diaSemana, horaInicio] = key.split('|')
      const [hh] = horaInicio.split(':').map(Number)
      return { diaSemana, horaInicio, horaFim: `${String(hh + 1).padStart(2, '0')}:00` }
    })
    disponibilidadeService.salvar(idUsuario, idProjeto, horarios)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  // ── Group filter ─────────────────────────────────────────
  const [filtro, setFiltro] = useState<Set<number>>(() => new Set(membros.map(m => m.idUsuario)))

  const toggleMembro = (id: number) =>
    setFiltro(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const selecionarTodos = () => setFiltro(new Set(membros.map(m => m.idUsuario)))
  const desmarcarTodos = () => setFiltro(new Set())

  // ── Heatmap computation ───────────────────────────────────
  const contagens = useMemo(() => {
    const mapa = new Map<string, number>()
    disponibilidadeService
      .todos(idProjeto)
      .filter(d => filtro.has(d.idUsuario))
      .forEach(d =>
        d.horarios.forEach(h => {
          const key = `${h.diaSemana}|${h.horaInicio}`
          mapa.set(key, (mapa.get(key) ?? 0) + 1)
        })
      )
    return mapa
  }, [idProjeto, filtro])

  const totalFiltrado = filtro.size
  const maxContagem = totalFiltrado > 0 ? Math.max(0, ...Array.from(contagens.values())) : 0

  const melhoresHorarios = useMemo(() => {
    if (maxContagem === 0) return []
    return Array.from(contagens.entries())
      .filter(([, c]) => c === maxContagem)
      .sort(([a], [b]) => {
        const [diaA, horaA] = a.split('|')
        const [diaB, horaB] = b.split('|')
        const diaOrd = DIAS.indexOf(diaA) - DIAS.indexOf(diaB)
        return diaOrd !== 0 ? diaOrd : horaA.localeCompare(horaB)
      })
      .map(([key]) => {
        const [dia, hora] = key.split('|')
        return `${DIAS_LABEL[DIAS.indexOf(dia)]} ${hora}`
      })
  }, [contagens, maxContagem])

  // ── Render ────────────────────────────────────────────────
  return (
    <div>
      {/* ── Seção 1: Minha disponibilidade ── */}
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 14, marginBottom: 6, color: '#333' }}>Minha Disponibilidade</h3>
        <p style={{ fontSize: 12, color: '#666', marginBottom: 10 }}>
          Clique nas células para marcar os horários em que você está livre.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: '6px 10px' }}>Hora</th>
                {DIAS_LABEL.map(d => (
                  <th key={d} style={{ border: '1px solid #ddd', padding: '6px 22px' }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HORAS.map(hora => (
                <tr key={hora}>
                  <td style={{ border: '1px solid #ddd', padding: '4px 10px', fontWeight: 600 }}>{hora}</td>
                  {DIAS.map(dia => {
                    const sel = meusSlotsStr.has(`${dia}|${hora}`)
                    return (
                      <td
                        key={dia}
                        onClick={() => toggleMeuSlot(dia, hora)}
                        style={{
                          border: '1px solid #ddd', padding: '6px 22px',
                          cursor: 'pointer', textAlign: 'center',
                          background: sel ? '#4caf50' : '#fafafa',
                          color: sel ? '#fff' : '',
                        }}
                      >
                        {sel ? '✓' : ''}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={salvar}
            style={{ padding: '7px 18px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          >
            Salvar Horários
          </button>
          {salvo && <span style={{ color: '#5cb85c', fontSize: 13 }}>Salvo!</span>}
        </div>
      </div>

      {/* ── Seção 2: Disponibilidade do grupo ── */}
      <div>
        <h3 style={{ fontSize: 14, marginBottom: 8, color: '#333' }}>Disponibilidade do Grupo</h3>

        {/* Filtro de integrantes */}
        <div style={{ marginBottom: 12, padding: '10px 14px', background: '#f8f8f8', border: '1px solid #e0e0e0', borderRadius: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>
              Integrantes ({filtro.size}/{membros.length} selecionado{filtro.size !== 1 ? 's' : ''}):
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={selecionarTodos} style={{ fontSize: 11, padding: '2px 8px', cursor: 'pointer' }}>Todos</button>
              <button onClick={desmarcarTodos} style={{ fontSize: 11, padding: '2px 8px', cursor: 'pointer' }}>Nenhum</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
            {membros.map(m => (
              <label key={m.idUsuario} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={filtro.has(m.idUsuario)}
                  onChange={() => toggleMembro(m.idUsuario)}
                />
                {m.nomeUsuario}
                {m.isGestor && <span style={{ fontSize: 10, color: '#888', fontStyle: 'italic' }}>gestor</span>}
              </label>
            ))}
          </div>
        </div>

        {/* Melhor horário */}
        {totalFiltrado === 0 ? (
          <p style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>Selecione ao menos um integrante para ver a disponibilidade.</p>
        ) : maxContagem === 0 ? (
          <div style={{ marginBottom: 12, padding: '8px 12px', background: '#fff3cd', border: '1px solid #f0ad4e', borderRadius: 4, fontSize: 13, color: '#856404' }}>
            Nenhum dos integrantes selecionados registrou horários livres ainda.
          </div>
        ) : (
          <div style={{ marginBottom: 12, padding: '8px 12px', background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: 4, fontSize: 13 }}>
            <strong>Melhor horário</strong> — {maxContagem} de {totalFiltrado} integrante{totalFiltrado !== 1 ? 's' : ''} livres:{' '}
            <span style={{ color: '#1a7a3a', fontWeight: 600 }}>
              {melhoresHorarios.slice(0, 6).join(', ')}
              {melhoresHorarios.length > 6 && ` +${melhoresHorarios.length - 6} mais`}
            </span>
          </div>
        )}

        {/* Legenda */}
        {totalFiltrado > 0 && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 11, color: '#666', alignItems: 'center', flexWrap: 'wrap' }}>
            <span>Legenda:</span>
            {[
              { label: 'Nenhum', r: 0 },
              { label: '1–24%', r: 0.12 },
              { label: '25–49%', r: 0.37 },
              { label: '50–74%', r: 0.62 },
              { label: '75–99%', r: 0.87 },
              { label: 'Todos', r: 1 },
            ].map(({ label, r }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ width: 14, height: 14, display: 'inline-block', background: slotBg(r * 4, 4), border: '1px solid #ccc', borderRadius: 2 }} />
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Heatmap */}
        {totalFiltrado > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={{ border: '1px solid #ddd', padding: '6px 10px' }}>Hora</th>
                  {DIAS_LABEL.map(d => (
                    <th key={d} style={{ border: '1px solid #ddd', padding: '6px 0', minWidth: 72, textAlign: 'center' }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HORAS.map(hora => (
                  <tr key={hora}>
                    <td style={{ border: '1px solid #ddd', padding: '4px 10px', fontWeight: 600 }}>{hora}</td>
                    {DIAS.map(dia => {
                      const count = contagens.get(`${dia}|${hora}`) ?? 0
                      const isMelhor = count > 0 && count === maxContagem
                      return (
                        <td
                          key={dia}
                          style={{
                            ...cellBase,
                            background: slotBg(count, totalFiltrado),
                            color: slotFg(count, totalFiltrado),
                            border: isMelhor ? '2px solid #1a7a3a' : '1px solid #ddd',
                            fontWeight: isMelhor ? 700 : 400,
                          }}
                          title={count > 0 ? `${count} de ${totalFiltrado} livres` : 'Nenhum livre'}
                        >
                          {count > 0 ? `${count}/${totalFiltrado}` : ''}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
