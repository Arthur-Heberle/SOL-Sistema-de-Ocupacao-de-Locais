import { useState } from 'react'
import type { CategoriaProj } from '../types'
import { projetoService } from '../services/projetoService'
import { useAuth } from '../context/AuthContext'
import { usuarioService } from '../services/usuarioService'
import { CATEGORIA_LABEL } from '../utils/rotulos'
import Alert from './ui/Alert'
import Button from './ui/Button'
import Checkbox from './ui/Checkbox'
import Field from './ui/Field'
import styles from './FormProjetoComponent.module.css'

const CATEGORIAS: CategoriaProj[] = ['EXTENSAO', 'PESQUISA', 'ENSINO', 'GESTAO']

interface Props {
  onCriado?: () => void
}

export default function FormProjetoComponent({ onCriado }: Props) {
  const { idUsuario } = useAuth()
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
    const usuario = usuarioService.listar().find(u => u.id === idUsuario)
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
    <form onSubmit={enviar} className={styles.form}>
      <Field label="Nome do projeto" required>
        <input value={nomeProjeto} onChange={e => setNomeProjeto(e.target.value)} placeholder="ex: PET Computação" />
      </Field>
      <Field label="Descrição" required>
        <textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows={4} placeholder="Descreva os objetivos do projeto..." />
      </Field>
      <Field label="Categoria">
        <select value={categoria} onChange={e => setCategoria(e.target.value as CategoriaProj)}>
          {CATEGORIAS.map(c => <option key={c} value={c}>{CATEGORIA_LABEL[c]}</option>)}
        </select>
      </Field>
      <Checkbox
        checked={incluirComoMembro}
        onChange={setIncluirComoMembro}
        label="Incluir-me como membro gestor deste projeto"
        description="Permite gerenciar membros e agendar atividades na sala exclusiva após aprovação."
      />
      {erro && <Alert tone="danger">{erro}</Alert>}
      {sucesso && <Alert tone="ok">{sucesso}</Alert>}
      <div className={styles.actions}>
        <Button type="submit">Registrar projeto</Button>
        <p className={styles.note}>O projeto ficará pendente até aprovação do Gestor.</p>
      </div>
    </form>
  )
}
