import { useState } from 'react'
import type { SalaDTO, TipoSala } from '../types'
import { salaService } from '../services/salaService'

const TIPOS_SALA: TipoSala[] = ['AULA', 'LABORATORIO', 'PROJETO', 'DEPARTAMENTO']

export default function GestaoSalasPage() {
  const [salas, setSalas] = useState<SalaDTO[]>(() => salaService.listar())
  const [mostraForm, setMostraForm] = useState(false)
  const [bloco, setBloco] = useState('')
  const [codigoNome, setCodigoNome] = useState('')
  const [tipoSala, setTipoSala] = useState<TipoSala>('AULA')
  const [capacidade, setCapacidade] = useState('')
  const [possuiProjetor, setPossuiProjetor] = useState(false)
  const [permiteReserva, setPermiteReserva] = useState(true)
  const [erro, setErro] = useState('')

  const recarregar = () => setSalas(salaService.listar())

  const criar = (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    if (!bloco.trim() || !codigoNome.trim() || !capacidade) { setErro('Preencha todos os campos obrigatórios.'); return }
    salaService.criar({ bloco: bloco.trim().toUpperCase(), codigoNome: codigoNome.trim().toUpperCase(), tipoSala, capacidade: Number(capacidade), possuiProjetor, permiteReserva })
    recarregar()
    setMostraForm(false)
    setBloco(''); setCodigoNome(''); setTipoSala('AULA'); setCapacidade(''); setPossuiProjetor(false); setPermiteReserva(true)
  }

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Gestão de Salas</h1>
        <button onClick={() => setMostraForm(!mostraForm)} style={{ padding: '8px 16px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {mostraForm ? 'Cancelar' : '+ Nova Sala'}
        </button>
      </div>
      {mostraForm && (
        <form onSubmit={criar} style={{ background: '#f9f9f9', padding: 16, borderRadius: 6, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <label style={{ fontSize: 13 }}>Bloco *<br /><input value={bloco} onChange={e => setBloco(e.target.value)} style={{ padding: 7, width: 80 }} placeholder="CB" /></label>
          <label style={{ fontSize: 13 }}>Código *<br /><input value={codigoNome} onChange={e => setCodigoNome(e.target.value)} style={{ padding: 7, width: 120 }} placeholder="CB-010" /></label>
          <label style={{ fontSize: 13 }}>Tipo<br />
            <select value={tipoSala} onChange={e => setTipoSala(e.target.value as TipoSala)} style={{ padding: 7 }}>
              {TIPOS_SALA.map(t => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label style={{ fontSize: 13 }}>Capacidade *<br /><input type="number" value={capacidade} onChange={e => setCapacidade(e.target.value)} style={{ padding: 7, width: 80 }} min="1" /></label>
          <label style={{ fontSize: 13, display: 'flex', alignItems: 'flex-end', gap: 6 }}>
            <input type="checkbox" checked={possuiProjetor} onChange={e => setPossuiProjetor(e.target.checked)} />
            Projetor
          </label>
          <label style={{ fontSize: 13, display: 'flex', alignItems: 'flex-end', gap: 6 }}>
            <input type="checkbox" checked={permiteReserva} onChange={e => setPermiteReserva(e.target.checked)} />
            Permite reserva
          </label>
          <button type="submit" style={{ padding: '7px 16px', background: '#5cb85c', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Salvar</button>
          {erro && <span style={{ color: '#d9534f', fontSize: 12 }}>{erro}</span>}
        </form>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#1a1a2e', color: '#fff' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left' }}>Código</th>
            <th style={{ padding: '10px 12px' }}>Bloco</th>
            <th style={{ padding: '10px 12px' }}>Tipo</th>
            <th style={{ padding: '10px 12px' }}>Cap.</th>
            <th style={{ padding: '10px 12px' }}>Projetor</th>
            <th style={{ padding: '10px 12px' }}>Reservas</th>
            <th style={{ padding: '10px 12px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {salas.map((s, i) => (
            <tr key={s.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
              <td style={{ border: '1px solid #eee', padding: '8px 12px' }}>{s.codigoNome}</td>
              <td style={{ border: '1px solid #eee', padding: '8px 12px', textAlign: 'center' }}>{s.bloco}</td>
              <td style={{ border: '1px solid #eee', padding: '8px 12px', textAlign: 'center' }}>{s.tipoSala}</td>
              <td style={{ border: '1px solid #eee', padding: '8px 12px', textAlign: 'center' }}>{s.capacidade}</td>
              <td style={{ border: '1px solid #eee', padding: '8px 12px', textAlign: 'center' }}>{s.possuiProjetor ? 'Sim' : 'Não'}</td>
              <td style={{ border: '1px solid #eee', padding: '8px 12px', textAlign: 'center' }}>
                <span style={{ background: s.permiteReserva ? '#d4edda' : '#f8d7da', color: s.permiteReserva ? '#155724' : '#721c24', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>
                  {s.permiteReserva ? 'Sim' : 'Não'}
                </span>
              </td>
              <td style={{ border: '1px solid #eee', padding: '8px 12px', textAlign: 'center' }}>
                <button onClick={() => { salaService.excluir(s.id); recarregar() }} style={{ fontSize: 11, padding: '3px 10px', cursor: 'pointer', background: '#d9534f', color: '#fff', border: 'none', borderRadius: 3 }}>
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
