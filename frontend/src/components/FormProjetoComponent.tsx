import { useState } from 'react'
import type { CategoriaProj } from '../types'
import { projetoService } from '../services/projetoService'
import { useAuth } from '../context/AuthContext'
import { usuarioService } from '../services/usuarioService'

const CATEGORIAS: { value: CategoriaProj; label: string }[] = [
  { value: 'EXTENSAO', label: 'Extensão' },
  { value: 'PESQUISA', label: 'Pesquisa' },
  { value: 'ENSINO', label: 'Ensino' },
  { value: 'GESTAO', label: 'Gestão' },
]

interface Props {
  onCriado?: () => void
}

export default function FormProjetoComponent({ onCriado }: Props) {
  const { nome } = useAuth()
  const [nomeProjeto, setNomeProjeto] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState<CategoriaProj>('EXTENSAO')
  const [incluirComoMembro, setIncluirComoMembro] = useState(true)
  const [sucesso, setSucesso] = useState('')
  const [erro, setErro] = useState('')

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    if (!nomeProjeto.trim() || !descricao.trim()) { setErro('Preencha todos os campos.'); return }
    const usuario = usuarioService.listar().find(u => u.nome === nome)
    const novoProjeto = projetoService.criar({
      nome: nomeProjeto.trim(),
      descricao: descricao.trim(),
      categoria,
      idTutor: usuario?.id ?? 0,
    })
    if (incluirComoMembro && usuario) {
      projetoService.adicionarMembro({
        idUsuario: usuario.id,
        idProjeto: novoProjeto.id,
        nomeUsuario: usuario.nome,
        emailUsuario: usuario.email,
        isGestor: true,
      })
    }
    setSucesso('Projeto registrado! Aguardando aprovação do Gestor de Salas.')
    setNomeProjeto('')
    setDescricao('')
    setCategoria('EXTENSAO')
    setIncluirComoMembro(true)
    onCriado?.()
    setTimeout(() => setSucesso(''), 4000)
  }

  return (
    <form onSubmit={enviar} style={{ maxWidth: 500 }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13 }}>
          Nome do Projeto *<br />
          <input
            value={nomeProjeto}
            onChange={e => setNomeProjeto(e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
            placeholder="ex: PET Computação"
          />
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13 }}>
          Descrição *<br />
          <textarea
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
            placeholder="Descreva os objetivos do projeto..."
          />
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13 }}>
          Categoria<br />
          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value as CategoriaProj)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          >
            {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </label>
      </div>
      <div style={{ marginBottom: 16, padding: '10px 12px', background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: 4 }}>
        <label style={{ fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={incluirComoMembro}
            onChange={e => setIncluirComoMembro(e.target.checked)}
            style={{ marginTop: 2, flexShrink: 0 }}
          />
          <span>
            Incluir-me como membro gestor deste projeto
            <span style={{ display: 'block', fontSize: 11, color: '#888', marginTop: 2 }}>
              Permite gerenciar membros e agendar atividades na sala exclusiva após aprovação.
            </span>
          </span>
        </label>
      </div>
      {erro && <p style={{ color: '#d9534f', fontSize: 13, marginBottom: 8 }}>{erro}</p>}
      {sucesso && <p style={{ color: '#5cb85c', fontSize: 13, marginBottom: 8 }}>{sucesso}</p>}
      <button
        type="submit"
        style={{ padding: '8px 20px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
      >
        Registrar Projeto
      </button>
      <p style={{ fontSize: 11, color: '#999', marginTop: 6 }}>O projeto ficará pendente até aprovação do Gestor.</p>
    </form>
  )
}
