import { useState } from 'react'
import type { DisciplinaDTO } from '../types'
import { disciplinaService } from '../services/disciplinaService'
import { usuarioService } from '../services/usuarioService'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Field from '../components/ui/Field'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import Table from '../components/ui/Table'
import styles from './Gestao.module.css'

export default function GestaoDisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState<DisciplinaDTO[]>(() => disciplinaService.listar())
  const [mostraForm, setMostraForm] = useState(false)
  const [codigo, setCodigo] = useState('')
  const [nome, setNome] = useState('')
  const [semestre, setSemestre] = useState('2026/1')
  const [idProfessor, setIdProfessor] = useState('')
  const [cargaHoraria, setCargaHoraria] = useState('')
  const [turma, setTurma] = useState('')
  const [erro, setErro] = useState('')

  const professores = usuarioService.listar().filter(u => u.tipoUsuario === 'PROFESSOR' && u.ativo)
  const recarregar = () => setDisciplinas(disciplinaService.listar())

  const fechar = () => {
    setMostraForm(false); setErro('')
    setCodigo(''); setNome(''); setSemestre('2026/1'); setIdProfessor(''); setCargaHoraria(''); setTurma('')
  }

  const criar = (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    if (!codigo.trim() || !nome.trim() || !idProfessor || !cargaHoraria || !turma.trim()) {
      setErro('Preencha todos os campos.'); return
    }
    disciplinaService.criar({ codigo: codigo.trim().toUpperCase(), nome: nome.trim(), semestre, idProfessor: Number(idProfessor), cargaHoraria: Number(cargaHoraria), turma: turma.trim().toUpperCase() })
    recarregar()
    fechar()
  }

  const nomeProfessor = (id: number) => usuarioService.listar().find(u => u.id === id)?.nome ?? `#${id}`

  return (
    <main>
      <PageHeader
        title="Gestão de disciplinas"
        subtitle="Cadastre as disciplinas do semestre e seus professores."
        actions={!mostraForm && <Button onClick={() => setMostraForm(true)}>Nova disciplina</Button>}
      />
      {mostraForm && (
        <Card title="Nova disciplina" className={styles.formCard}>
          <form onSubmit={criar}>
            <div className={styles.formGrid}>
              <Field label="Código" required>
                <input value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="IF66D" />
              </Field>
              <Field label="Nome" required>
                <input value={nome} onChange={e => setNome(e.target.value)} />
              </Field>
              <Field label="Semestre">
                <input value={semestre} onChange={e => setSemestre(e.target.value)} placeholder="2026/1" />
              </Field>
              <Field label="Professor" required>
                <select value={idProfessor} onChange={e => setIdProfessor(e.target.value)}>
                  <option value="">Selecione...</option>
                  {professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </Field>
              <Field label="Carga horária (h)" required>
                <input type="number" min="1" value={cargaHoraria} onChange={e => setCargaHoraria(e.target.value)} />
              </Field>
              <Field label="Turma" required>
                <input value={turma} onChange={e => setTurma(e.target.value)} placeholder="TB01" />
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
        <Table caption="Disciplinas cadastradas">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th data-align="center">Semestre</th>
              <th>Professor</th>
              <th data-align="center">CH</th>
              <th data-align="center">Turma</th>
              <th data-align="center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {disciplinas.map(d => (
              <tr key={d.id}>
                <td className={styles.mono}>{d.codigo}</td>
                <td>{d.nome}</td>
                <td data-align="center">{d.semestre}</td>
                <td>{nomeProfessor(d.idProfessor)}</td>
                <td data-align="center">{d.cargaHoraria}h</td>
                <td data-align="center">{d.turma}</td>
                <td data-align="center">
                  <Button size="sm" variant="danger" onClick={() => { disciplinaService.excluir(d.id); recarregar() }}>Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </main>
  )
}
