import type { CategoriaProj } from '../types'

const CATEGORIAS: CategoriaProj[] = ['ENSINO', 'PESQUISA', 'EXTENSAO', 'GESTAO']

export default function FormProjetoComponent() {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 4, padding: 16, maxWidth: 500 }}>
      <strong>[FormProjetoComponent]</strong>
      <p style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
        UC006: TODO: onSubmit(dados: ProjetoDTO) → POST /projetos → status PENDENTE (awaits GESTOR approval)
      </p>
      {/* TODO: connect to ProjetoApiService.criarProjeto() */}
      <form onSubmit={e => { e.preventDefault(); alert('TODO: POST /projetos') }}>
        <div style={{ marginBottom: 8 }}>
          <label>Nome do Projeto<br />
            <input style={{ width: '100%', padding: 6 }} placeholder="ex: PET Computação" />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Descrição<br />
            <textarea style={{ width: '100%', padding: 6 }} rows={3} placeholder="Descreva o projeto..." />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Categoria<br />
            <select style={{ width: '100%', padding: 6 }}>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>Registrar Projeto (Pendente)</button>
      </form>
    </div>
  )
}
