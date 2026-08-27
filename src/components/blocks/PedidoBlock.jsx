// ARCHIVO: PedidoBlock.jsx
// RUTA: frontend/src/components/blocks/PedidoBlock.jsx
// DESCRIPCIÓN: Alta rápida de pedidos. Precarga EAN13 desde Asistente, solo queda elegir cliente.

import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';

const ESTADOS_PEDIDO = ['Pendiente', 'Solicitado', 'Ingresado', 'Notificado', 'Agotado', 'Cancelado'];

export const PedidoBlock = ({ libroPrecargado, onClearPrecarga }) => {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [idClienteSelect, setIdClienteSelect] = useState('');
  const [ean13Legacy, setEan13Legacy] = useState('');
  const [eanInput, setEanInput] = useState('');
  const [clienteId, setClienteId] = useState('');

  useEffect(() => {
    if (libroPrecargado) {
      const ean = (libroPrecargado.ean13_legacy || libroPrecargado.EAN13 || '').toString().trim();
      if (ean) setEan13Legacy(ean);
    }
  }, [libroPrecargado]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([api.getPedidos(), api.getClientes()]);
      setPedidos(p); setClientes(c); setError(null);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { cargarDatos(); }, []);

  const handleAltaRapida = async (e) => {
    e.preventDefault();
    if (!idClienteSelect ||!ean13Legacy.trim()) return;
    try {
      await api.altaRapidaPedido({ id_cliente: idClienteSelect, ean13_legacy: ean13Legacy.trim() });
      setEan13Legacy(''); if (onClearPrecarga) onClearPrecarga(); cargarDatos();
    } catch (e) { setError(e.message); }
  };

  const handleCambiarEstado = async (id, est) => {
    try { await api.updateEstadoPedido(id, est); cargarDatos(); } catch (e) { setError(e.message); }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Gestión de Pedidos</h2>
      {libroPrecargado && <div style={{ padding: '10px 12px', backgroundColor: '#fff8e1', border: '1px solid #ffe082', borderRadius: '6px', marginBottom: '12px', fontSize: '0.9rem' }}>Precargado: <strong>{libroPrecargado.Titulo}</strong> — EAN13: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{ean13Legacy}</span>. Solo elegí el cliente.</div>}
      {error && <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '16px' }}>{error}</div>}

      <form onSubmit={handleAltaRapida} style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
        <h3>Alta Rápida de Pedido</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select value={idClienteSelect} onChange={(e) => setIdClienteSelect(e.target.value)} required autoFocus={!!libroPrecargado} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}>
            <option value="">-- Seleccionar Cliente --</option>
            {clientes.map(c => (<option key={c.id_cliente} value={c.id_cliente}>{c.nombre} (ID: {c.id_cliente})</option>))}
          </select>
          <input type="text" placeholder="EAN13 Legacy *" value={ean13Legacy} onChange={(e) => setEan13Legacy(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1, fontFamily: 'monospace' }} />
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Crear Pedido</button>
        </div>
      </form>

      {loading? <p>Cargando...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ backgroundColor: '#e0e0e0' }}><th style={{ padding: '10px' }}>ID</th><th style={{ padding: '10px' }}>Cliente</th><th style={{ padding: '10px' }}>EAN13 Legacy</th><th style={{ padding: '10px' }}>Fecha</th><th style={{ padding: '10px' }}>Estado</th><th style={{ padding: '10px' }}>Cambiar</th></tr></thead>
          <tbody>{pedidos.map(p => (<tr key={p.id_pedido} style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px' }}>#{p.id_pedido}</td><td style={{ padding: '10px' }}>{p.cliente?.nombre || p.id_cliente}</td><td style={{ padding: '10px', fontFamily: 'monospace' }}>{p.ean13_legacy}</td><td style={{ padding: '10px' }}>{new Date(p.fecha_creacion).toLocaleDateString()}</td><td style={{ padding: '10px' }}>{p.estado}</td><td style={{ padding: '10px' }}><select value={p.estado} onChange={(e) => handleCambiarEstado(p.id_pedido, e.target.value)}>{ESTADOS_PEDIDO.map(s => <option key={s} value={s}>{s}</option>)}</select></td></tr>))}</tbody>
        </table>
      )}
    </div>
  );
};