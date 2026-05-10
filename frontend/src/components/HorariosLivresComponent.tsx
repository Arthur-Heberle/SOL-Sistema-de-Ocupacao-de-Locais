import { useState, useEffect } from 'react'
import { disponibilidadeService } from '../services/disponibilidadeService'
import { useAuth } from '../context/AuthContext'
import { usuarioService } from '../services/usuarioService'
import type { HorarioDTO } from '../types'

interface Props {
  idProjeto: number
}

const DIAS = ['SEGUNDA','TERCA','QUARTA','QUINTA','SEXTA']
const DIAS_LABEL = ['Seg','Ter','Qua','Qui','Sex']
const HORAS = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00']

export default function HorariosLivresComponent({ idProjeto }: Props) {
  const { nome } = useAuth()
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set())
  const [interseccao, setInterseccao] = useState<HorarioDTO[]>([])
  const [salvo, setSalvo] = useState(false)

  const getUsuarioId = () => usuarioService.listar().find(u => u.nome === nome)?.id ?? 0

  useEffect(() => {
    const idUsuario = getUsuarioId()
    const horarios = disponibilidadeService.carregar(idUsuario, idProjeto)
    setSelecionados(new Set(horarios.map(h => `${h.diaSemana}|${h.horaInicio}`)))
    setInterseccao(disponibilidadeService.interseccao(idProjeto))
  }, [idProjeto])

  const toggle = (dia: string, hora: string) => {
    const key = `${dia}|${hora}`
    setSelecionados(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const salvar = () => {
    const horarios: HorarioDTO[] = Array.from(selecionados).map(key => {
      const [diaSemana, horaInicio] = key.split('|')
      const [hh, mm] = horaInicio.split(':').map(Number)
      const horaFim = `${String(hh + 1).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
      return { diaSemana, horaInicio, horaFim }
    })
    disponibilidadeService.salvar(getUsuarioId(), idProjeto, horarios)
    setInterseccao(disponibilidadeService.interseccao(idProjeto))
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  const isIntersec = (dia: string, hora: string) =>
    interseccao.some(h => h.diaSemana === dia && h.horaInicio === hora)

  return (
    <div>
      <p style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>
        Clique nas células para marcar seus horários livres. Células em <strong style={{ color: '#1a7a3a' }}>verde escuro</strong> são comuns a todos os membros.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ddd', padding: '6px 10px' }}>Hora</th>
              {DIAS.map((d, i) => <th key={d} style={{ border: '1px solid #ddd', padding: '6px 20px' }}>{DIAS_LABEL[i]}</th>)}
            </tr>
          </thead>
          <tbody>
            {HORAS.map(hora => (
              <tr key={hora}>
                <td style={{ border: '1px solid #ddd', padding: '4px 10px', fontWeight: 600 }}>{hora}</td>
                {DIAS.map(dia => {
                  const key = `${dia}|${hora}`
                  const selecionado = selecionados.has(key)
                  const comum = isIntersec(dia, hora)
                  return (
                    <td
                      key={dia}
                      onClick={() => toggle(dia, hora)}
                      style={{
                        border: '1px solid #ddd',
                        padding: '6px 20px',
                        cursor: 'pointer',
                        background: comum ? '#1a7a3a' : selecionado ? '#a8d5a2' : '#fafafa',
                        textAlign: 'center',
                      }}
                    >
                      {comum ? <span style={{ color: '#fff' }}>✓</span> : selecionado ? '✓' : ''}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        <button onClick={salvar} style={{ padding: '8px 20px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Salvar Horários
        </button>
        {salvo && <span style={{ color: '#5cb85c', fontSize: 13 }}>Salvo!</span>}
      </div>
      {interseccao.length > 0 && (
        <p style={{ fontSize: 12, color: '#1a7a3a', marginTop: 8 }}>
          Horários comuns a todos: {interseccao.map(h => `${h.diaSemana} ${h.horaInicio}`).join(', ')}
        </p>
      )}
    </div>
  )
}
