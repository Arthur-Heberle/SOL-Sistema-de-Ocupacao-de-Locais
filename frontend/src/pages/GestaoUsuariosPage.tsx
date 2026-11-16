import { useState } from 'react'
import type { UsuarioDTO, TipoUsuario } from '../types'
import { usuarioService } from '../services/usuarioService'
import { TIPO_USUARIO_LABEL } from '../utils/rotulos'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Field from '../components/ui/Field'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Alert from '../components/ui/Alert'
import Table from '../components/ui/Table'
import styles from './Gestao.module.css'

const TIPOS: TipoUsuario[] = ['ALUNO', 'PROFESSOR', 'TUTOR', 'GESTOR']

export default function GestaoUsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioDTO[]>(() => usuarioService.listar())
  const [mostraForm, setMostraForm] = useState(false)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [tipo, setTipo] = useState<TipoUsuario>('ALUNO')
  const [erro, setErro] = useState('')

  const recarregar = () => setUsuarios(usuarioService.listar())

  const fechar = () => {
    setMostraForm(false); setErro('')
    setNome(''); setEmail(''); setTipo('ALUNO')
  }

  const criar = (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    if (!nome.trim() || !email.trim()) { setErro('Preencha todos os campos.'); return }
    if (usuarioService.listar().some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setErro('E-mail já cadastrado.'); return
    }
    usuarioService.criar({ nome: nome.trim(), email: email.trim().toLowerCase(), tipoUsuario: tipo, ativo: true })
    recarregar()
    fechar()
  }

  return (
    <main>
      <PageHeader
        title="Gestão de usuários"
        subtitle="Cadastre usuários e controle quem pode acessar o sistema."
        actions={!mostraForm && <Button onClick={() => setMostraForm(true)}>Novo usuário</Button>}
      />
      {mostraForm && (
        <Card title="Novo usuário" className={styles.formCard}>
          <form onSubmit={criar}>
            <div className={styles.formGrid}>
              <Field label="Nome" required>
                <input value={nome} onChange={e => setNome(e.target.value)} />
              </Field>
              <Field label="E-mail" required>
                <input value={email} onChange={e => setEmail(e.target.value)} />
              </Field>
              <Field label="Perfil">
                <select value={tipo} onChange={e => setTipo(e.target.value as TipoUsuario)}>
                  {TIPOS.map(t => <option key={t} value={t}>{TIPO_USUARIO_LABEL[t]}</option>)}
                </select>
              </Field>
            </div>
            {erro && <div className={styles.erro}><Alert tone="danger">{erro}</Alert></div>}
            <div className={styles.formFooter}>
              <Button type="submit">Salvar</Button>
              <Button variant="secondary" onClick={fechar}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}
      <Card flush>
        <Table caption="Usuários cadastrados">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th data-align="center">Perfil</th>
              <th data-align="center">Status</th>
              <th data-align="center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td data-align="center"><Badge tone="neutral">{TIPO_USUARIO_LABEL[u.tipoUsuario]}</Badge></td>
                <td data-align="center"><Badge tone={u.ativo ? 'ok' : 'danger'} dot>{u.ativo ? 'Ativo' : 'Inativo'}</Badge></td>
                <td data-align="center">
                  <Button size="sm" variant="secondary" onClick={() => { usuarioService.toggleAtivo(u.id); recarregar() }}>
                    {u.ativo ? 'Desativar' : 'Ativar'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </main>
  )
}
