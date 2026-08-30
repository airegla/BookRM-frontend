// ARCHIVO: PedidoBlock.jsx
// RUTA: frontend/src/components/blocks/PedidoBlock.jsx
// DESCRIPCIÓN: Alta rápida de pedidos. Precarga EAN13 desde Asistente, solo queda elegir cliente.

import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import { usePagination } from '../../hooks/usePagination';
import { useIsMobile } from '../../hooks/useIsMobile';
import { Pagination } from '../ui/Pagination';
import { SearchSelect } from '../ui/SearchSelect';
import { ESTADOS_PEDIDO } from '../../constants';
import DebugTag from '../../ui/DebugTag';

const colorEstado = (estado) => {
  switch (estado) {
    case 'Pendiente': return '#ed6c02';
    case 'Solicitado': return '#1976d2';
    case 'Ingresado': return '#2e7d32';
    case 'Notificado': return '#00838f';
    case 'Agotado': return '#c62828';
    case 'Cancelado': return '#757575';
    default: return '#666';
  }
};

export const PedidoBlock = ({ libroPrecargado, onClearPrecarga }) => {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [idClienteSelect, setIdClienteSelect] = useState('');
  const [ean13Legacy, setEan13Legacy] = useState('');
  const [eanInput, setEanInput] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [showAlta, setShowAlta] = useState(false);
  const [editPedido, setEditPedido] = useState(null);
  const [editEan, setEditEan] = useState('');
  const pag = usePagination(pedidos, (p) => `${p.cliente?.nombre || ''} ${p.ean13_legacy} ${p.titulo || ''} ${p.autor || ''} ${p.editorial || ''} ${p.estado}`, 8);
  const isMobile = useIsMobile();

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
      setEan13Legacy(''); setShowAlta(false); if (onClearPrecarga) onClearPrecarga(); cargarDatos();
    } catch (e) { setError(e.message); }
  };

  const handleCambiarEstado = async (id, est) => {
    try { await api.updateEstadoPedido(id, est); cargarDatos(); } catch (e) { setError(e.message); }
  };

  const abrirEditarEan = (p) => { setEditPedido({ id: p.id_pedido }); setEditEan(p.ean13_legacy || ''); };

  const guardarEan = async (e) => {
    e.preventDefault();
    if (!editEan.trim()) return;
    try {
      await api.updateEan13Pedido(editPedido.id, editEan.trim());
      setEditPedido(null);
      cargarDatos();
    } catch (e) { setError(e.message); }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <DebugTag name="PedidoBlock.jsx" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Gestión de Pedidos</h2>
        <button onClick={() => setShowAlta(true)} style={{ padding: '8px 14px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Crear pedido</button>
      </div>
      {libroPrecargado && <div style={{ padding: '10px 12px', backgroundColor: '#fff8e1', border: '1px solid #ffe082', borderRadius: '6px', margin: '12px 0', fontSize: '0.9rem' }}>Precargado: <strong>{libroPrecargado.Titulo}</strong> — EAN13: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{ean13Legacy}</span>. Solo elegí el cliente.</div>}
      {error && <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '16px' }}>{error}</div>}

      {showAlta && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowAlta(false)}>
          <form onSubmit={handleAltaRapida} className="modal-card" style={{ background: '#fff', borderRadius: '8px', padding: '20px', width: '420px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Alta Rápida de Pedido</h3>
            <label style={{ display: 'block', marginBottom: '10px' }}>Cliente *
              <SearchSelect
                options={clientes.map(c => ({ value: c.id_cliente, label: `${c.nombre} (ID: ${c.id_cliente})` }))}
                value={idClienteSelect}
                onChange={(v) => setIdClienteSelect(v)}
                placeholder="Seleccionar cliente..."
              />
            </label>
            <label style={{ display: 'block', marginBottom: '16px' }}>EAN13 *
              <input type="text" value={ean13Legacy} onChange={(e) => setEan13Legacy(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box', fontFamily: 'monospace' }} />
            </label>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowAlta(false)} style={{ padding: '8px 14px', cursor: 'pointer' }}>Cancelar</button>
              <button type="submit" style={{ padding: '8px 14px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Crear Pedido</button>
            </div>
          </form>
        </div>
      )}

      {editPedido && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setEditPedido(null)}>
          <form onSubmit={guardarEan} className="modal-card" style={{ background: '#fff', borderRadius: '8px', padding: '20px', width: '360px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Editar EAN13 del pedido #{editPedido.id}</h3>
            <label style={{ display: 'block', marginBottom: '16px' }}>EAN13 *
              <input type="text" value={editEan} onChange={(e) => setEditEan(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box', fontFamily: 'monospace' }} />
            </label>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setEditPedido(null)} style={{ padding: '8px 14px', cursor: 'pointer' }}>Cancelar</button>
              <button type="submit" style={{ padding: '8px 14px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Guardar</button>
            </div>
          </form>
        </div>
      )}

      {loading? <p>Cargando...</p> : (
        <>
          <input
            placeholder="Buscar pedido (cliente, EAN, título, autor...)"
            value={pag.query}
            onChange={(e) => { pag.setQuery(e.target.value); pag.setPage(1); }}
            style={{ width: '100%', maxWidth: '360px', padding: '8px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
          {isMobile ? (
            <div>
              {pag.pageItems.length === 0 && <p style={{ color: '#999', fontSize: '0.9rem' }}>Sin pedidos.</p>}
              {pag.pageItems.map(p => (
                <div key={p.id_pedido} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '14px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <strong style={{ fontSize: '0.95rem' }}>{p.titulo || 'Sin título'}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#666', marginTop: 2 }}>{[p.autor, p.editorial].filter(Boolean).join(' — ') || '—'}</div>
                    </div>
                    <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold', color: '#fff', background: colorEstado(p.estado), flexShrink: 0 }}>{p.estado}</span>
                  </div>
                  <div style={{ marginTop: 8, fontSize: '0.82rem', color: '#333' }}>
                    <div>👤 <strong>{p.cliente?.nombre || `Cliente #${p.id_cliente}`}</strong> · Pedido #{p.id_pedido}</div>
                    <div style={{ fontFamily: 'monospace', marginTop: 2 }}>EAN: {p.ean13_legacy}</div>
                    <div style={{ color: '#999', marginTop: 2 }}>{new Date(p.fecha_creacion).toLocaleDateString('es-AR')}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
                    <select value={p.estado} onChange={(e) => handleCambiarEstado(p.id_pedido, e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.85rem', background: '#fff' }}>
                      {ESTADOS_PEDIDO.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {p.estado === 'Pendiente' && <button type="button" onClick={() => abrirEditarEan(p)} style={{ padding: '8px 10px', border: '1px solid #ccc', background: '#fff', borderRadius: '6px', cursor: 'pointer' }} title="Editar EAN13">✏️</button>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ backgroundColor: '#e0e0e0' }}><th style={{ padding: '10px' }}>ID</th><th style={{ padding: '10px' }}>Cliente</th><th style={{ padding: '10px' }}>EAN13</th><th style={{ padding: '10px' }}>Título</th><th style={{ padding: '10px' }}>Autor</th><th style={{ padding: '10px' }}>Editorial</th><th style={{ padding: '10px' }}>Fecha</th><th style={{ padding: '10px' }}>Estado</th><th style={{ padding: '10px' }}>Cambiar</th></tr></thead>
          <tbody>{pag.pageItems.map(p => (<tr key={p.id_pedido} style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px' }}>#{p.id_pedido}</td><td style={{ padding: '10px' }}>{p.cliente?.nombre || p.id_cliente}</td><td style={{ padding: '10px', fontFamily: 'monospace' }}>{p.ean13_legacy}</td><td style={{ padding: '10px', fontSize: '0.85rem' }}>{p.titulo || '—'}</td><td style={{ padding: '10px', fontSize: '0.85rem' }}>{p.autor || '—'}</td><td style={{ padding: '10px', fontSize: '0.85rem' }}>{p.editorial || '—'}</td><td style={{ padding: '10px' }}>{new Date(p.fecha_creacion).toLocaleDateString()}</td><td style={{ padding: '10px' }}>{p.estado}</td><td style={{ padding: '10px' }}><div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}><select value={p.estado} onChange={(e) => handleCambiarEstado(p.id_pedido, e.target.value)}>{ESTADOS_PEDIDO.map(s => <option key={s} value={s}>{s}</option>)}</select>{p.estado === 'Pendiente' && <button type="button" onClick={() => abrirEditarEan(p)} title="Editar EAN13" style={{ cursor: 'pointer', padding: '2px 8px' }}>✏️</button>}</div></td></tr>))}</tbody>
        </table>
          )}
        <Pagination page={pag.page} totalPages={pag.totalPages} onChange={pag.setPage} />
        </>
      )}
    </div>
  );
};