export default function GestaoSalasPage() {
  return (
    <main>
      <h1>Gestão de Salas</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>UC010: Manter Salas (CRUD) — GESTOR only</p>
      {/* TODO: rooms table with columns: bloco, codigoNome, tipoSala, capacidade, possuiProjetor, permiteReserva */}
      <div style={{ background: '#f0f0f0', padding: 16, borderRadius: 4 }}>
        [Tabela de salas — TODO]<br />
        Colunas: bloco, codigoNome, tipoSala (LABORATÓRIO/AULA/PROJETO/DEPARTAMENTO), capacidade, permiteReserva
      </div>
    </main>
  )
}
