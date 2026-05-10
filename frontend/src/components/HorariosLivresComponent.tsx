export default function HorariosLivresComponent() {
  const days = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA']
  const times = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']

  return (
    <div>
      <strong>[HorariosLivresComponent]</strong>
      <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
        UC008: integrantes marcam horários livres · sistema calcula interseção para sugerir reuniões
        <br />TODO: props: idProjeto: number · onSalvar: (dto: DisponibilidadeDTO) =&gt; void
        <br />TODO: GET /disponibilidades/:idProjeto · POST /disponibilidades
      </p>
      <table style={{ borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '4px 8px' }}>Hora</th>
            {days.map(d => <th key={d} style={{ border: '1px solid #ddd', padding: '4px 8px' }}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {times.map(t => (
            <tr key={t}>
              <td style={{ border: '1px solid #ddd', padding: '4px 8px', fontSize: 11 }}>{t}</td>
              {days.map(d => (
                <td key={d} style={{ border: '1px solid #ddd', padding: '4px 16px', cursor: 'pointer', background: '#fafafa' }}
                  onClick={() => alert(`TODO: toggle availability ${d} ${t}`)}>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button style={{ marginTop: 8, padding: '6px 16px' }} onClick={() => alert('TODO: POST /disponibilidades')}>
        Salvar Horários
      </button>
    </div>
  )
}
