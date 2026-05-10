import { useState } from 'react'
import type { MembroProjetoDTO } from '../types'
import { projetoService } from '../services/projetoService'
import { usuarioService } from '../services/usuarioService'
import { useAuth } from '../context/AuthContext'

interface Props {
  idProjeto: number
}

export default function MembrosListComponent({ idProjeto }: Props) {
  const { nome, tipoUsuario } = useAuth()
  const usuarioLogado = usuarioService.listar().find(u => u.nome === nome)
  const membroLogado = projetoService.membros(idProjeto).find(m => m.idUsuario === usuarioLogado?.id)
  const podeGerenciar = tipoUsuario === 'GESTOR' || membroLogado?.isGestor

  const [membros, setMembros] = useState<MembroProjetoDTO[]>(() => projetoService.membros(idProjeto))
  const [novoEmail, setNovoEmail] = useState('')
  const [erro, setErro] = useState('')

  const adicionar = () => {
    setErro('')
    const usuario = usuarioService.listar().find(u => u.email.toLowerCase() === novoEmail.toLowerCase())
    if (!usuario) { setErro('Usuário não encontrado com esse e-mail.'); return }
    if (membros.some(m => m.idUsuario === usuario.id)) { setErro('Usuário já é membro.'); return }
    projetoService.adicionarMembro({ idUsuario: usuario.id, idProjeto, nomeUsuario: usuario.nome, emailUsuario: usuario.email, isGestor: false })
    setMembros(projetoService.membros(idProjeto))
    setNovoEmail('')
  }

  const remover = (id: number) => {
    projetoService.removerMembro(id)
    setMembros(projetoService.membros(idProjeto))
  }

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 16 }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px 12px', textAlign: 'left' }}>Nome</th>
            <th style={{ border: '1px solid #ddd', padding: '8px 12px', textAlign: 'left' }}>E-mail</th>
            <th style={{ border: '1px solid #ddd', padding: '8px 12px' }}>Papel</th>
            {podeGerenciar && <th style={{ border: '1px solid #ddd', padding: '8px 12px' }}>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {membros.map(m => (
            <tr key={m.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px 12px' }}>{m.nomeUsuario}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px 12px' }}>{m.emailUsuario}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px 12px', textAlign: 'center' }}>
                {m.isGestor ? 'Gestor' : 'Membro'}
              </td>
              {podeGerenciar && (
                <td style={{ border: '1px solid #ddd', padding: '8px 12px', textAlign: 'center' }}>
                  {!m.isGestor && (
                    <button onClick={() => remover(m.id)} style={{ background: '#d9534f', color: '#fff', border: 'none', padding: '3px 10px', borderRadius: 3, cursor: 'pointer', fontSize: 12 }}>
                      Remover
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {podeGerenciar && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <label style={{ fontSize: 13 }}>
            Adicionar por e-mail<br />
            <input value={novoEmail} onChange={e => setNovoEmail(e.target.value)} placeholder="usuario@utfpr.edu.br" style={{ padding: '6px 8px', width: 260 }} />
          </label>
          <button onClick={adicionar} style={{ padding: '6px 14px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Adicionar
          </button>
          {erro && <span style={{ color: '#d9534f', fontSize: 12 }}>{erro}</span>}
        </div>
      )}
    </div>
  )
}
