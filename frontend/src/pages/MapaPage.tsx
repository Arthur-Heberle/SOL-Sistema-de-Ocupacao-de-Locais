import FiltroBarraComponent from '../components/FiltroBarraComponent'
import MapaComponent from '../components/MapaComponent'

export default function MapaPage() {
  return (
    <main>
      <h1>Mapa de Salas</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>
        UC005: visualizar grade · UC002: reserva diária · UC003: reserva semestral
      </p>
      <FiltroBarraComponent />
      <MapaComponent />
    </main>
  )
}
