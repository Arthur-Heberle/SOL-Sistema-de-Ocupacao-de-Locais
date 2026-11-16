import { useMemo, useState } from 'react'
import { disponibilidadeService } from '../services/disponibilidadeService'
import { projetoService } from '../services/projetoService'
import { useAuth } from '../context/AuthContext'
import type { HorarioDTO } from '../types'
import { DIAS_SEMANA, DIAS_SEMANA_CURTO, HORAS_DISPONIBILIDADE } from '../utils/rotulos'
import Button from './ui/Button'
import styles from './HorariosLivresComponent.module.css'

interface Props {
  idProjeto: number
}

const chave = (dia: string, hora: string) => `${dia}|${hora}`
const horaFim = (hora: string) => `${String(Number(hora.slice(0, 2)) + 1).padStart(2, '0')}:00`
const rotuloSlot = (key: string) => {
  const [dia, hora] = key.split('|')
  return `${DIAS_SEMANA_CURTO[DIAS_SEMANA.indexOf(dia as typeof DIAS_SEMANA[number])]} ${hora}`
}

/** 0 = nobody, 1..5 = sequential intensity buckets by share of selected members. */
function nivel(count: number, total: number): number {
  if (total === 0 || count === 0) return 0
  const r = count / total
  if (r >= 1) return 5
  if (r >= 0.75) return 4
  if (r >= 0.5) return 3
  if (r >= 0.25) return 2
  return 1
}

function primeiroNome(nome: string) {
  return nome.replace(/^Prof\.\s*/, '').split(' ')[0]
}

export default function HorariosLivresComponent({ idProjeto }: Props) {
  const { idUsuario } = useAuth()
  const membros = projetoService.membros(idProjeto)
  const souMembro = membros.some(m => m.idUsuario === idUsuario)

  // My availability
  const [meus, setMeus] = useState<Set<string>>(() =>
    new Set(idUsuario ? disponibilidadeService.carregar(idUsuario, idProjeto).map(h => chave(h.diaSemana, h.horaInicio)) : []),
  )
  const [estado, setEstado] = useState<'limpo' | 'alterado' | 'salvo'>('limpo')
  const [versao, setVersao] = useState(0)

  const alternar = (key: string) => {
    setMeus(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
    setEstado('alterado')
  }

  const salvar = () => {
    if (!idUsuario) return
    const horarios: HorarioDTO[] = [...meus].map(key => {
      const [diaSemana, horaInicio] = key.split('|')
      return { diaSemana, horaInicio, horaFim: horaFim(horaInicio) }
    })
    disponibilidadeService.salvar(idUsuario, idProjeto, horarios)
    setEstado('salvo')
    setVersao(v => v + 1)
  }

  // Group heatmap
  const [filtro, setFiltro] = useState<Set<number>>(() => new Set(membros.map(m => m.idUsuario)))
  const alternarMembro = (id: number) =>
    setFiltro(prev => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  const livresPorSlot = useMemo(() => {
    void versao
    const mapa = new Map<string, number[]>()
    for (const d of disponibilidadeService.todos(idProjeto)) {
      if (!filtro.has(d.idUsuario)) continue
      for (const h of d.horarios) {
        const k = chave(h.diaSemana, h.horaInicio)
        mapa.set(k, [...(mapa.get(k) ?? []), d.idUsuario])
      }
    }
    return mapa
  }, [idProjeto, filtro, versao])

  const total = filtro.size
  const max = Math.max(0, ...[...livresPorSlot.values()].map(v => v.length))
  const melhores = max === 0 ? [] : [...livresPorSlot.entries()]
    .filter(([, ids]) => ids.length === max)
    .map(([k]) => k)
    .sort((a, b) => {
      const [da, ha] = a.split('|')
      const [db, hb] = b.split('|')
      return DIAS_SEMANA.indexOf(da as typeof DIAS_SEMANA[number]) - DIAS_SEMANA.indexOf(db as typeof DIAS_SEMANA[number]) || ha.localeCompare(hb)
    })
  const nomeDe = (id: number) => membros.find(m => m.idUsuario === id)?.nomeUsuario ?? `#${id}`

  return (
    <div className={styles.layout}>
      {souMembro && (
        <section className={styles.painel} aria-labelledby="minha-disp">
          <header className={styles.painelHead}>
            <div>
              <h3 id="minha-disp">Minha disponibilidade</h3>
              <p>Clique nos horários em que você está livre.</p>
            </div>
          </header>
          <table className={styles.grade}>
            <thead>
              <tr>
                <th><span className="visually-hidden">Hora</span></th>
                {DIAS_SEMANA_CURTO.map(d => <th key={d} scope="col">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {HORAS_DISPONIBILIDADE.map(hora => (
                <tr key={hora}>
                  <th scope="row">{hora}</th>
                  {DIAS_SEMANA.map((dia, i) => {
                    const k = chave(dia, hora)
                    const sel = meus.has(k)
                    return (
                      <td key={dia}>
                        <button
                          type="button"
                          className={styles.toggle}
                          aria-pressed={sel}
                          aria-label={`${DIAS_SEMANA_CURTO[i]} ${hora}: ${sel ? 'livre' : 'ocupado'}`}
                          onClick={() => alternar(k)}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <footer className={styles.painelFoot}>
            <span className={styles.status} aria-live="polite">
              {estado === 'alterado' && 'Alterações não salvas'}
              {estado === 'salvo' && 'Horários salvos'}
              {estado === 'limpo' && `${meus.size} ${meus.size === 1 ? 'horário marcado' : 'horários marcados'}`}
            </span>
            <Button size="sm" onClick={salvar} disabled={estado !== 'alterado'}>Salvar horários</Button>
          </footer>
        </section>
      )}

      <section className={`${styles.painel} ${styles.grupo}`} aria-labelledby="disp-grupo">
        <header className={styles.painelHead}>
          <div>
            <h3 id="disp-grupo">Disponibilidade do grupo</h3>
            <p>Quanto mais escuro, mais integrantes livres no horário.</p>
          </div>
          <div className={styles.headActions}>
            <Button size="sm" variant="ghost" onClick={() => setFiltro(new Set(membros.map(m => m.idUsuario)))}>Todos</Button>
            <Button size="sm" variant="ghost" onClick={() => setFiltro(new Set())}>Nenhum</Button>
          </div>
        </header>

        <div className={styles.chips} role="group" aria-label="Integrantes considerados">
          {membros.map(m => (
            <button
              key={m.idUsuario}
              type="button"
              className={styles.chip}
              aria-pressed={filtro.has(m.idUsuario)}
              onClick={() => alternarMembro(m.idUsuario)}
            >
              {m.nomeUsuario}
              {m.isGestor && <span className={styles.chipTag}>gestor</span>}
            </button>
          ))}
        </div>

        {total === 0 ? (
          <p className={styles.aviso}>Selecione ao menos um integrante para calcular a disponibilidade.</p>
        ) : max === 0 ? (
          <p className={styles.aviso}>Nenhum dos integrantes selecionados registrou horários livres.</p>
        ) : (
          <div className={styles.melhor}>
            <span className={styles.melhorLabel}>
              {max === total ? 'Todos livres' : `${max} de ${total} livres`}
            </span>
            <span className={styles.melhorSlots}>
              {melhores.slice(0, 6).map(k => <span key={k}>{rotuloSlot(k)}</span>)}
              {melhores.length > 6 && <span className={styles.maisSlots}>+{melhores.length - 6}</span>}
            </span>
          </div>
        )}

        <table className={`${styles.grade} ${styles.heat}`}>
          <thead>
            <tr>
              <th><span className="visually-hidden">Hora</span></th>
              {DIAS_SEMANA_CURTO.map(d => <th key={d} scope="col">{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {HORAS_DISPONIBILIDADE.map(hora => (
              <tr key={hora}>
                <th scope="row">{hora}</th>
                {DIAS_SEMANA.map(dia => {
                  const ids = livresPorSlot.get(chave(dia, hora)) ?? []
                  const n = ids.length
                  const melhor = n > 0 && n === max
                  const nomes = ids.map(i => primeiroNome(nomeDe(i))).join(', ')
                  return (
                    <td key={dia}>
                      <span
                        className={`${styles.cell} ${melhor ? styles.best : ''}`}
                        data-nivel={nivel(n, total)}
                        title={n > 0 ? `${n} de ${total} livres: ${nomes}` : 'Ninguém livre'}
                      >
                        {n > 0 ? `${n}/${total}` : ''}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {total > 0 && (
          <div className={styles.legenda} aria-label="Legenda">
            <span>Menos</span>
            {[0, 1, 2, 3, 4, 5].map(l => <span key={l} className={styles.cell} data-nivel={l} />)}
            <span>Todos</span>
            <span className={styles.legendaBest}><span className={`${styles.cell} ${styles.best}`} data-nivel={5} /> Melhor horário</span>
          </div>
        )}
      </section>
    </div>
  )
}
