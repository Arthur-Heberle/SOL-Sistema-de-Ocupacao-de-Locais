import HorariosLivresComponent from '../components/HorariosLivresComponent'
import FormProjetoComponent from '../components/FormProjetoComponent'

export default function ProjetoPage() {
  return (
    <main>
      <h1>Gerenciar Projeto</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>
        UC006: Registrar Projeto · UC007: Gerenciar Sala/Atividades · UC008: Horários Livres · UC012: Membros
      </p>
      <section style={{ marginBottom: 24 }}>
        <h2>Detalhes do Projeto</h2>
        <FormProjetoComponent />
      </section>
      <section style={{ marginBottom: 24 }}>
        <h2>Horários Livres dos Integrantes</h2>
        <HorariosLivresComponent />
      </section>
      <section>
        <h2>Membros</h2>
        {/* TODO: MembrosListComponent — UC012 */}
        <div style={{ background: '#f0f0f0', padding: 16, borderRadius: 4 }}>
          [MembrosListComponent — TODO]
        </div>
      </section>
    </main>
  )
}
