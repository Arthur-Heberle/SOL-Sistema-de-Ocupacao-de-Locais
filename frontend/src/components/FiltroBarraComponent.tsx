export default function FiltroBarraComponent() {
  return (
    <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 4, marginBottom: 16 }}>
      <strong>[FiltroBarraComponent]</strong>
      <p style={{ fontSize: 12, color: '#666' }}>
        TODO: inputs for bloco, dataFoco (date), idProjeto → emits FiltroMapaDTO to parent
      </p>
      {/* TODO: props: onFiltroChange: (filtro: FiltroMapaDTO) => void */}
      {/* TODO: inputs: bloco (string), dataFoco (date picker), idProjeto (select from ProjetoApiService) */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Bloco (ex: CB)" style={{ padding: 6 }} />
        <input type="date" style={{ padding: 6 }} />
        <button style={{ padding: '6px 12px' }}>Filtrar</button>
      </div>
    </div>
  )
}
