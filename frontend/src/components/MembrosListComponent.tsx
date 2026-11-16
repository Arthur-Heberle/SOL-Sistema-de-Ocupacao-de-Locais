import { useState } from 'react'
import type { MembroProjetoDTO } from '../types'
import { projetoService } from '../services/projetoService'
import { usuarioService } from '../services/usuarioService'
import { useAuth } from '../context/AuthContext'
import Alert from './ui/Alert'
import Badge from './ui/Badge'
import Button from './ui/Button'
import Field from './ui/Field'
import Table from './ui/Table'
import styles from './MembrosListComponent.module.css'

interface Props {
  idProjeto: number
}

export default function MembrosListComponent({ idProjeto }: Props) {
  const { idUsuario, tipoUsuario } = useAuth()
  const usuarioLogado = usuarioService.listar().find(u => u.id === idUsuario)
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
    <div className={styles.wrap}>
      <Table caption="Membros do projeto">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th data-align="center">Papel</th>
            {podeGerenciar && <th data-align="center">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {membros.map(m => (
            <tr key={m.id}>
              <td>{m.nomeUsuario}</td>
              <td>{m.emailUsuario}</td>
              <td data-align="center">
                <Badge tone={m.isGestor ? 'accent' : 'neutral'}>{m.isGestor ? 'Gestor' : 'Membro'}</Badge>
              </td>
              {podeGerenciar && (
                <td data-align="center">
                  {!m.isGestor && <Button size="sm" variant="danger" onClick={() => remover(m.id)}>Remover</Button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      {podeGerenciar && (
        <div className={styles.add}>
          <Field label="Adicionar por e-mail" className={styles.addField}>
            <input value={novoEmail} onChange={e => setNovoEmail(e.target.value)} placeholder="usuario@utfpr.edu.br" />
          </Field>
          <Button onClick={adicionar}>Adicionar</Button>
        </div>
      )}
      {erro && <Alert tone="danger">{erro}</Alert>}
    </div>
  )
}
