import type { ReservaDTO, SalaDTO } from '../types'

interface Props {
  reservas: ReservaDTO[]
  salas: SalaDTO[]
}

const HORAS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00']
const DIAS_LABEL = ['Seg','Ter','Qua','Qui','Sex']

export default function CalendarioComponent({ reservas, salas }: Props) {
  const getSala = (id: number) => salas.find(s => s.id === id)

  const getReservasNaHora = (diaIdx: number, hora: string) => {
    return reservas.filter(r => {
      const d = new Date(r.dataInicio)
      // getDay(): 1=Mon, 2=Tue... subtract 1 for 0-based index
      if (d.getDay() - 1 !== diaIdx) return false
      const h = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      return h === hora
    })
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#1a1a2e', color: '#fff' }}>
            <th style={{ padding: '6px 10px', textAlign: 'left', minWidth: 60 }}>Hora</th>
            {DIAS_LABEL.map(d => <th key={d} style={{ padding: '6px 12px', minWidth: 100 }}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {HORAS.map(hora => (
            <tr key={hora}>
              <td style={{ border: '1px solid #ddd', padding: '4px 10px', fontWeight: 600, fontSize: 11, background: '#f8f8f8' }}>{hora}</td>
              {DIAS_LABEL.map((_, dIdx) => {
                const ocupacoes = getReservasNaHora(dIdx, hora)
                return (
                  <td key={dIdx} style={{ border: '1px solid #ddd', padding: 4, verticalAlign: 'top' }}>
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
