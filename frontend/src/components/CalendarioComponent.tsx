import type { ReservaDTO, SalaDTO } from '../types'

interface Props {
  reservas: ReservaDTO[]
  salas: SalaDTO[]
  dataFoco?: string
}

const HORAS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00']
const DIAS_LABEL = ['Seg','Ter','Qua','Qui','Sex']

function getMondayOfWeek(dateStr: string): Date {
  const d = new Date(dateStr + 'T12:00')
  const dow = d.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  d.setDate(d.getDate() + diff)
  return d
}

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0]
}

function fmt(d: Date): string {
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`
}

export default function CalendarioComponent({ reservas, salas, dataFoco }: Props) {
  const getSala = (id: number) => salas.find(s => s.id === id)

  const today = new Date().toISOString().split('T')[0]
  const ref = dataFoco ?? today
  const monday = getMondayOfWeek(ref)
  const weekDates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    return d
  })
  const weekDateStrs = weekDates.map(toDateStr)
  const friday = weekDates[4]
  const weekLabel = `${fmt(monday)} – ${fmt(friday)} / ${friday.getFullYear()}`

  const getReservasNaHora = (colIdx: number, hora: string): ReservaDTO[] => {
    const colDateStr = weekDateStrs[colIdx]
    const colDow = new Date(colDateStr + 'T12:00').getDay()
    return reservas.filter(r => {
      const rDow = new Date(r.dataInicio).getDay()
      const rDateStr = r.dataInicio.slice(0, 10)
      const rHora = r.dataInicio.slice(11, 16)
      if (rHora !== hora) return false
      if (r.recorrente) return rDow === colDow
      return rDateStr === colDateStr
    })
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Semana: {weekLabel}</p>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#1a1a2e', color: '#fff' }}>
            <th style={{ padding: '6px 10px', textAlign: 'left', minWidth: 60 }}>Hora</th>
            {weekDates.map((d, i) => {
              const isRef = weekDateStrs[i] === ref
              return (
                <th
                  key={i}
                  style={{ padding: '6px 12px', minWidth: 100, background: isRef ? '#2d2d5e' : undefined }}
                >
                  {DIAS_LABEL[i]}<br />
                  <span style={{ fontSize: 10, opacity: 0.8 }}>{fmt(d)}</span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {HORAS.map(hora => (
            <tr key={hora}>
              <td style={{ border: '1px solid #ddd', padding: '4px 10px', fontWeight: 600, fontSize: 11, background: '#f8f8f8' }}>{hora}</td>
              {weekDates.map((_, colIdx) => {
                const isRef = weekDateStrs[colIdx] === ref
                const ocupacoes = getReservasNaHora(colIdx, hora)
                return (
                  <td
                    key={colIdx}
                    style={{ border: '1px solid #ddd', padding: 4, verticalAlign: 'top', background: isRef ? '#f5f5ff' : undefined }}
                  >
                    {ocupacoes.map(r => (
                      <div key={r.id} style={{ background: '#1a1a2e', color: '#fff', borderRadius: 3, padding: '2px 6px', fontSize: 10, marginBottom: 2 }}>
                        {r.titulo}<br />
                        <span style={{ opacity: 0.7 }}>{getSala(r.idSala)?.codigoNome}</span>
                      </div>
                    ))}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
