export default function GestaoUsuariosPage() {
  return (
    <main>
      <h1>Gestão de Usuários</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>UC009: Manter Usuários (CRUD) — GESTOR only</p>
      {/* TODO: user table with columns: nome, email, tipoUsuario, ativo */}
      {/* TODO: actions: create/edit/deactivate */}
      <div style={{ background: '#f0f0f0', padding: 16, borderRadius: 4 }}>
        [Tabela de usuários — TODO]<br />
        Colunas: nome, email, tipoUsuario (ALUNO/PROFESSOR/TUTOR/GESTOR), ativo
      </div>
    </main>
  )
}
