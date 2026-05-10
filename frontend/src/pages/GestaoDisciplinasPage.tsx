export default function GestaoDisciplinasPage() {
  return (
    <main>
      <h1>Gestão de Disciplinas</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>UC011: Manter Disciplinas (CRUD) — GESTOR only</p>
      {/* TODO: disciplines table with columns: codigo, nome, semestre, idProfessor, cargaHoraria, turma */}
      {/* TODO: batch import option */}
      <div style={{ background: '#f0f0f0', padding: 16, borderRadius: 4 }}>
        [Tabela de disciplinas — TODO]<br />
        Colunas: codigo, nome, semestre (AAAA/N), professor, cargaHoraria, turma
      </div>
    </main>
  )
}
