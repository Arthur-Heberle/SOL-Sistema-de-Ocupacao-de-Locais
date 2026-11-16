import { useState } from 'react'
import type { SalaDTO, TipoSala } from '../types'
import { salaService } from '../services/salaService'
import { TIPO_SALA_LABEL } from '../utils/rotulos'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Field from '../components/ui/Field'
import Checkbox from '../components/ui/Checkbox'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Alert from '../components/ui/Alert'
import Table from '../components/ui/Table'
import styles from './Gestao.module.css'

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

  const fechar = () => {
    setMostraForm(false); setErro('')
    setBloco(''); setCodigoNome(''); setTipoSala('AULA'); setCapacidade(''); setPossuiProjetor(false); setPermiteReserva(true)
  }

  const criar = (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    if (!bloco.trim() || !codigoNome.trim() || !capacidade) { setErro('Preencha todos os campos obrigatórios.'); return }
    salaService.criar({ bloco: bloco.trim().toUpperCase(), codigoNome: codigoNome.trim().toUpperCase(), tipoSala, capacidade: Number(capacidade), possuiProjetor, permiteReserva })
    recarregar()
    fechar()
  }

  return (
    <main>
      <PageHeader
        title="Gestão de salas"
        subtitle="Cadastre e organize os locais disponíveis no campus."
        actions={!mostraForm && <Button onClick={() => setMostraForm(true)}>Nova sala</Button>}
      />
      {mostraForm && (
        <Card title="Nova sala" className={styles.formCard}>
          <form onSubmit={criar}>
            <div className={styles.formGrid}>
              <Field label="Bloco" required>
                <input value={bloco} onChange={e => setBloco(e.target.value)} placeholder="CB" />
              </Field>
              <Field label="Código" required>
                <input value={codigoNome} onChange={e => setCodigoNome(e.target.value)} placeholder="CB-010" />
              </Field>
              <Field label="Tipo">
                <select value={tipoSala} onChange={e => setTipoSala(e.target.value as TipoSala)}>
                  {TIPOS_SALA.map(t => <option key={t} value={t}>{TIPO_SALA_LABEL[t]}</option>)}
                </select>
              </Field>
              <Field label="Capacidade" required>
                <input type="number" min="1" value={capacidade} onChange={e => setCapacidade(e.target.value)} />
              </Field>
              <div className={styles.checks}>
                <Checkbox checked={possuiProjetor} onChange={setPossuiProjetor} label="Possui projetor" />
                <Checkbox checked={permiteReserva} onChange={setPermiteReserva} label="Permite reserva" />
              </div>
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
        <Table caption="Salas cadastradas">
          <thead>
            <tr>
              <th>Código</th>
              <th data-align="center">Bloco</th>
              <th data-align="center">Tipo</th>
              <th data-align="center">Capacidade</th>
              <th data-align="center">Projetor</th>
              <th data-align="center">Reservas</th>
              <th data-align="center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {salas.map(s => (
              <tr key={s.id}>
                <td className={styles.mono}>{s.codigoNome}</td>
                <td data-align="center">{s.bloco}</td>
                <td data-align="center"><Badge tone="neutral">{TIPO_SALA_LABEL[s.tipoSala]}</Badge></td>
                <td data-align="center">{s.capacidade}</td>
                <td data-align="center">{s.possuiProjetor ? 'Sim' : 'Não'}</td>
                <td data-align="center">
                  <Badge tone={s.permiteReserva ? 'ok' : 'danger'} dot>{s.permiteReserva ? 'Permite' : 'Não permite'}</Badge>
                </td>
                <td data-align="center">
                  <Button size="sm" variant="danger" onClick={() => { salaService.excluir(s.id); recarregar() }}>Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </main>
  )
}
