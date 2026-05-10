import CardSolicitacaoComponent from '../components/CardSolicitacaoComponent'

export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard — Solicitações Pendentes</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>UC004: Aprovar Solicitações do Sistema</p>
      <section>
        <h2>Reservas Pendentes</h2>
        {/* TODO: load from GET /reservas/pendentes */}
        <CardSolicitacaoComponent />
      </section>
    </main>
  )
}
