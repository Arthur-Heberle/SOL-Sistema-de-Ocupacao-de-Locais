export default function CalendarioComponent() {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
  const times = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']

  return (
    <div>
      <strong>[CalendarioComponent]</strong>
      <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
        TODO: props: dataSelecionada: LocalDate, onDiaClick: (date: string) =&gt; void · weekly grid with time slots
      </p>
      <table style={{ borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '4px 8px' }}>Hora</th>
            {days.map(d => <th key={d} style={{ border: '1px solid #ddd', padding: '4px 16px' }}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {times.map(t => (
            <tr key={t}>
              <td style={{ border: '1px solid #ddd', padding: '4px 8px', fontSize: 11 }}>{t}</td>
              {days.map(d => (
                <td key={d} style={{ border: '1px solid #ddd', padding: '4px 8px', background: '#fafafa', cursor: 'pointer' }}
                  onClick={() => alert(`TODO: onDiaClick(${d} ${t})`)}>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
