import { useMemo, useState } from 'react'
import type { FiltroMapaDTO, SalaDTO } from '../types'
import FiltroBarraComponent from '../components/FiltroBarraComponent'
import MapaComponent from '../components/MapaComponent'
import type { SalaComOcupacao } from '../components/MapaComponent'
import CalendarioComponent from '../components/CalendarioComponent'
import ModalReservaComponent from '../components/ModalReservaComponent'
import PageHeader from '../components/ui/PageHeader'
import { reservaService } from '../services/reservaService'
import { salaService } from '../services/salaService'
import { formatDataLonga, hojeISO } from '../utils/datas'
import styles from './MapaPage.module.css'

type Aba = 'mapa' | 'grade'

export default function MapaPage() {
  const [filtro, setFiltro] = useState<FiltroMapaDTO>(() => ({ dataFoco: hojeISO() }))
  const [aba, setAba] = useState<Aba>('mapa')
  const [salaSelecionada, setSalaSelecionada] = useState<SalaDTO | null>(null)
  const [versao, setVersao] = useState(0)

  const dataFoco = filtro.dataFoco ?? hojeISO()

  const salas = useMemo<SalaComOcupacao[]>(() => {
    void versao // recompute after a reservation is created
    return salaService
      .listar(filtro)
      .map(sala => ({ sala, reservas: reservaService.doDia(sala.id, dataFoco) }))
      .filter(s => !filtro.apenasLivres || (s.sala.permiteReserva && s.reservas.length === 0))
  }, [filtro, dataFoco, versao])

  const reservaveis = salas.filter(s => s.sala.permiteReserva)
  const livres = reservaveis.filter(s => s.reservas.length === 0).length

  return (
    <>
      <PageHeader
        eyebrow={<span className={styles.data}>{formatDataLonga(dataFoco)}</span>}
        title="Mapa de salas"
        subtitle="Consulte a ocupação dos espaços do campus e solicite reservas."
      />

      <FiltroBarraComponent filtro={filtro} onFiltroChange={setFiltro} />

      <div className={styles.toolbar}>
        <div className={styles.tabs} role="tablist" aria-label="Visualização">
          <button type="button" role="tab" aria-selected={aba === 'mapa'} onClick={() => setAba('mapa')}>Salas</button>
          <button type="button" role="tab" aria-selected={aba === 'grade'} onClick={() => setAba('grade')}>Grade semanal</button>
        </div>
        {aba === 'mapa' && (
          <dl className={styles.resumo}>
            <div><dt>Salas</dt><dd>{salas.length}</dd></div>
            <div><dt>Livres no dia</dt><dd className={styles.ok}>{livres}</dd></div>
            <div><dt>Com reservas</dt><dd className={styles.busy}>{reservaveis.length - livres}</dd></div>
          </dl>
        )}
      </div>

      <div role="tabpanel">
        {aba === 'mapa' ? (
          <MapaComponent salas={salas} onSelecionar={setSalaSelecionada} />
        ) : (
          <CalendarioComponent
            reservas={reservaService.listar({ status: 'APROVADA' }).filter(r => salas.some(s => s.sala.id === r.idSala))}
            salas={salas.map(s => s.sala)}
            dataFoco={dataFoco}
          />
        )}
      </div>

      {salaSelecionada && (
        <ModalReservaComponent
          sala={salaSelecionada}
          dataInicial={dataFoco}
          onFechar={() => setSalaSelecionada(null)}
          onCriada={() => setVersao(v => v + 1)}
        />
      )}
    </>
  )
}
