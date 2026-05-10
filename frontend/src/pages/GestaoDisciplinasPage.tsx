import { useState } from 'react'
import type { DisciplinaDTO } from '../types'
import { disciplinaService } from '../services/disciplinaService'
import { usuarioService } from '../services/usuarioService'

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

  const criar = (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    if (!codigo.trim() || !nome.trim() || !idProfessor || !cargaHoraria || !turma.trim()) {
      setErro('Preencha todos os campos.'); return
    }
    disciplinaService.criar({ codigo: codigo.trim().toUpperCase(), nome: nome.trim(), semestre, idProfessor: Number(idProfessor), cargaHoraria: Number(cargaHoraria), turma: turma.trim().toUpperCase() })
    recarregar()
    setMostraForm(false)
    setCodigo(''); setNome(''); setSemestre('2026/1'); setIdProfessor(''); setCargaHoraria(''); setTurma('')
  }

  const nomeProfessor = (id: number) => usuarioService.listar().find(u => u.id === id)?.nome ?? `#${id}`

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Gestão de Disciplinas</h1>
        <button onClick={() => setMostraForm(!mostraForm)} style={{ padding: '8px 16px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {mostraForm ? 'Cancelar' : '+ Nova Disciplina'}
        </button>
      </div>
      {mostraForm && (
        <form onSubmit={criar} style={{ background: '#f9f9f9', padding: 16, borderRadius: 6, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <label style={{ fontSize: 13 }}>Código *<br /><input value={codigo} onChange={e => setCodigo(e.target.value)} style={{ padding: 7, width: 90 }} placeholder="IF66D" /></label>
          <label style={{ fontSize: 13 }}>Nome *<br /><input value={nome} onChange={e => setNome(e.target.value)} style={{ padding: 7, width: 220 }} /></label>
          <label style={{ fontSize: 13 }}>Semestre<br /><input value={semestre} onChange={e => setSemestre(e.target.value)} style={{ padding: 7, width: 80 }} placeholder="2026/1" /></label>
          <label style={{ fontSize: 13 }}>Professor *<br />
            <select value={idProfessor} onChange={e => setIdProfessor(e.target.value)} style={{ padding: 7 }}>
              <option value="">Selecione...</option>
              {professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </label>
          <label style={{ fontSize: 13 }}>CH *<br /><input type="number" value={cargaHoraria} onChange={e => setCargaHoraria(e.target.value)} style={{ padding: 7, width: 60 }} min="1" /></label>
          <label style={{ fontSize: 13 }}>Turma *<br /><input value={turma} onChange={e => setTurma(e.target.value)} style={{ padding: 7, width: 80 }} placeholder="TB01" /></label>
          <button type="submit" style={{ padding: '7px 16px', background: '#5cb85c', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Salvar</button>
          {erro && <span style={{ color: '#d9534f', fontSize: 12 }}>{erro}</span>}
        </form>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#1a1a2e', color: '#fff' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left' }}>Código</th>
            <th style={{ padding: '10px 12px', textAlign: 'left' }}>Nome</th>
            <th style={{ padding: '10px 12px' }}>Semestre</th>
            <th style={{ padding: '10px 12px', textAlign: 'left' }}>Professor</th>
            <th style={{ padding: '10px 12px' }}>CH</th>
            <th style={{ padding: '10px 12px' }}>Turma</th>
            <th style={{ padding: '10px 12px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {disciplinas.map((d, i) => (
            <tr key={d.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
              <td style={{ border: '1px solid #eee', padding: '8px 12px' }}>{d.codigo}</td>
              <td style={{ border: '1px solid #eee', padding: '8px 12px' }}>{d.nome}</td>
              <td style={{ border: '1px solid #eee', padding: '8px 12px', textAlign: 'center' }}>{d.semestre}</td>
              <td style={{ border: '1px solid #eee', padding: '8px 12px' }}>{nomeProfessor(d.idProfessor)}</td>
              <td style={{ border: '1px solid #eee', padding: '8px 12px', textAlign: 'center' }}>{d.cargaHoraria}h</td>
              <td style={{ border: '1px solid #eee', padding: '8px 12px', textAlign: 'center' }}>{d.turma}</td>
              <td style={{ border: '1px solid #eee', padding: '8px 12px', textAlign: 'center' }}>
                <button onClick={() => { disciplinaService.excluir(d.id); recarregar() }} style={{ fontSize: 11, padding: '3px 10px', cursor: 'pointer', background: '#d9534f', color: '#fff', border: 'none', borderRadius: 3 }}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
