// ARCHIVO: RadarBlock.jsx
// RUTA: frontend/src/components/blocks/RadarBlock.jsx
// DESCRIPCIÓN: Radar FIX - muestra todo, con debug y botón recargar.

import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import DebugTag from '../../ui/DebugTag';

export const RadarBlock = () => {
  const [pedidos, setPedidos] = useState([]);
  const [radar, setRadar] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificandoId, setNotificandoId] = useState(null);
  const [ultimoEnvio, setUltimoEnvio] = useState(null);
  const [filtro, setFiltro] = useState('');

  const cargar = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pedidosData, radarData, recsData] = await Promise.all([
        api.getPedidos().catch(e => { console.error('pedidos', e); return []; }),
        api.getRadarIngresos().catch(() => []),
        api.getRecomendaciones().catch(() => [])
      ]);
      // Backend puede devolver {pedidos: []} o []
      const listaPedidos = Array.isArray(pedidosData)? pedidosData : (pedidosData.pedidos || pedidosData.data || []);
      const listaRadar = Array.isArray(radarData)? radarData : (radarData.data || []);
      console.log('[Radar] pedidos', listaPedidos.length, 'radar', listaRadar.length);
      setPedidos(listaPedidos);
      setRadar(listaRadar);
      setRecomendaciones(Array.isArray(recsData)? recsData : (recsData.data || []));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const q = filtro.trim().toLowerCase();
  const pedidosFiltrados = q
    ? pedidos.filter(p => `${p.cliente?.nombre || ''} ${p.ean13_legacy} ${p.titulo || ''} ${p.estado}`.toLowerCase().includes(q))
    : pedidos;

  const solicitados = pedidosFiltrados.filter(p => p.estado === 'Solicitado');
  const ingresados = pedidosFiltrados.length ? pedidosFiltrados.filter(p => p.estado === 'Ingresado') : radar;
  const notificados = pedidosFiltrados.filter(p => p.estado === 'Notificado').slice(0, 50);
  const pendientes = pedidosFiltrados.filter(p => p.estado === 'Pendiente');

  const handleMarcarIngresado = async (id) => { await api.updateEstadoPedido(id, 'Ingresado'); cargar(); };
  const handleNotificar = async (id) => {
    setNotificandoId(id);
    try {
      const result = await api.notificarIngreso(id);
      setUltimoEnvio(result);
      cargar();
    } catch (e) { setError(e.message); }
    finally { setNotificandoId(null); }
  };

  const descargarCsv = async (estado) => {
    try {
      const csv = await api.exportPedidosCsv(estado);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pedidos_${estado || 'todos'}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) { setError(e.message); }
  };

  const Tabla = ({ lista, tipo }) => {
    if (!lista || lista.length === 0) return <p style={{ color: '#999', fontSize: '0.9rem' }}>Sin pedidos en {tipo}. {tipo==='Pendiente' && 'Creá uno en pestaña Pedidos.'}</p>;
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead><tr style={{ background: '#e0e0e0' }}><th style={{ padding: '8px', textAlign: 'left' }}>ID</th><th>Cliente</th><th>EAN13</th><th>Estado</th><th>Acción</th></tr></thead>
        <tbody>
          {lista.map(p => (
            <tr key={p.id_pedido || p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>#{p.id_pedido || p.id}</td>
              <td style={{ padding: '8px' }}>{p.cliente?.nombre || p.nombre_cliente || '-'}</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>{p.ean13_legacy || p.ean13 || '-'}</td>
              <td style={{ padding: '8px' }}><span style={{ background: '#eee', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>{p.estado}</span></td>
              <td style={{ padding: '8px' }}>
                {p.estado === 'Pendiente' && <span style={{ fontSize: '0.75rem', color: '#999' }}>Esperando envío proveedor</span>}
                {p.estado === 'Solicitado' && <button onClick={() => handleMarcarIngresado(p.id_pedido)} style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px' }}>→ Ingresado</button>}
                {p.estado === 'Ingresado' && <button disabled={notificandoId===p.id_pedido} onClick={() => handleNotificar(p.id_pedido)} style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px' }}>{notificandoId===p.id_pedido? 'Enviando...' : '📧 Notificar'}</button>}
                {p.estado === 'Notificado' && <span style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '0.75rem' }}>Avisado</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  const [checking, setChecking] = useState(false);
const handleCheckStock = async () => {
  setChecking(true);
  try {
    const r = await api.checkIngresos();
    alert(`Revisados: ${r.revisados} | Pasaron a Ingresado: ${r.actualizados}`);
    cargar();
  } catch (e) { setError(e.message); }
  finally { setChecking(false); }
};

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <DebugTag name="RadarBlock.jsx" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📨 Radar / Avisos</h2>
        <button onClick={cargar} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>🔄 Recargar</button>
        <button onClick={handleCheckStock} disabled={checking} style={{ padding: '6px 12px', background: '#ff9800', color: '#fff', border: 'none', borderRadius: '4px', marginLeft: '8px' }}>
  {checking? 'Verificando stock...' : '📦 Verificar ingresos (stock legacy)'}
</button>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', margin: '12px 0' }}>
        <input
          placeholder="Filtrar (cliente, EAN, título, estado)..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ flex: 1, minWidth: '220px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button onClick={() => descargarCsv('Pendiente')} style={{ padding: '8px 10px', fontSize: '0.8rem' }}>⬇ CSV Pendientes</button>
        <button onClick={() => descargarCsv('Solicitado')} style={{ padding: '8px 10px', fontSize: '0.8rem' }}>⬇ CSV Solicitados</button>
        <button onClick={() => descargarCsv('Notificado')} style={{ padding: '8px 10px', fontSize: '0.8rem' }}>⬇ CSV Notificados</button>
      </div>
      {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '12px' }}>{error} — revisá backend en http://localhost:3000/api/pedidos</div>}
      {ultimoEnvio && <div style={{ background: '#e8f5e9', padding: '10px', borderRadius: '4px', marginBottom: '12px', fontSize: '0.85rem' }}>✅ Mail a {ultimoEnvio.cliente?.nombre} — {ultimoEnvio.email?.to} {ultimoEnvio.email?.previewUrl && <a href={ultimoEnvio.email.previewUrl} target="_blank">Ver preview</a>}</div>}
      {loading? <p>Cargando...</p> : (
        <>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Total pedidos: {pedidos.length} | Pendiente: {pendientes.length} | Solicitado: {solicitados.length} | Ingresado: {ingresados.length} | Notificado: {notificados.length}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0' }}><h3 style={{ marginTop: 0, color: '#ef6c00' }}>Pendiente ({pendientes.length})</h3><Tabla lista={pendientes} tipo="Pendiente" /></div>
            <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0' }}><h3 style={{ marginTop: 0, color: '#ef6c00' }}>Solicitado ({solicitados.length})</h3><Tabla lista={solicitados} tipo="Solicitado" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0' }}><h3 style={{ marginTop: 0, color: '#2e7d32' }}>Ingresado ({ingresados.length})</h3><Tabla lista={ingresados} tipo="Ingresado" /></div>
            <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0' }}><h3 style={{ marginTop: 0 }}>Notificado ({notificados.length})</h3><Tabla lista={notificados} tipo="Notificado" /></div>
          </div>
        </>
      )}
    </div>
  );
};