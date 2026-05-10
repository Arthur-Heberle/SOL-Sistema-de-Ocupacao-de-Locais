export default function ModalReservaComponent() {
  return (
    <div style={{ border: '2px dashed #ccc', padding: 16, borderRadius: 4 }}>
      <strong>[ModalReservaComponent]</strong>
      <p style={{ fontSize: 12, color: '#666' }}>
        TODO: props: dadosReserva: Partial&lt;ReservaDTO&gt;, aberto: boolean, onConfirmar: () =&gt; void, onCancelar: () =&gt; void
      </p>
      <ul style={{ fontSize: 12, color: '#555' }}>
        <li>Fields: titulo, visibilidade (PUBLICA/PRIVADA), dataInicio, dataFim, recorrente</li>
        <li>If tipoSala=PROJETO: show "Aguardando aprovação do Gestor" badge</li>
        <li>If tipoSala=DEPARTAMENTO: button disabled with "Sala não disponível para reserva"</li>
        <li>On confirm: POST /reservas with ReservaDTO</li>
      </ul>
    </div>
  )
}
