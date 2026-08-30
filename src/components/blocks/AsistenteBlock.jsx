// ARCHIVO: AsistenteBlock.jsx
// RUTA: frontend/src/components/blocks/AsistenteBlock.jsx
// DESCRIPCIÓN: Asistente de Mostrador + alta rápida de cliente sin perder cards

import React, { useState, useEffect } from 'react';
import { useAsistente } from '../../hooks/useAsistente';
import { useIsMobile } from '../../hooks/useIsMobile';
import { RecomendacionCard } from '../ui/RecomendacionCard';
import { SearchSelect } from '../ui/SearchSelect';
import { api } from '../../api/api.js';
import DebugTag from '../../ui/DebugTag';

export const AsistenteBlock = ({ onSeleccionarParaPedido }) => {
  const [prompt, setPrompt] = useState('');
  const { loading, error, resultado, consultarAsistente, limpiarResultado } = useAsistente();
  const isMobile = useIsMobile();

  // alta rápida cliente
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [nuevoCliente, setNuevoCliente] = useState({ nombre:'', email:'', telefono:'' });
  const [showClienteRapido, setShowClienteRapido] = useState(false);

  useEffect(()=>{ 
    api.getClientes().then(setClientes).catch(()=>{});
  }, []);

  const handleAltaClienteRapida = async () => {
    if(!nuevoCliente.nombre) return alert('Nombre requerido');
    try {
      const cli = await api.createCliente(nuevoCliente);
      const cliReal = cli.id_cliente ? cli : (cli.data || cli);
      setClientes(prev=>[...prev, cliReal]);
      setClienteSeleccionado(cliReal.id_cliente);
      setNuevoCliente({ nombre:'', email:'', telefono:'' });
      setShowClienteRapido(false);
    } catch(e) {
      alert('Error: '+e.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    consultarAsistente(prompt);
  };

  const res = resultado || { en_stock: [], a_pedir: [] };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <DebugTag name="AsistenteBlock.jsx" />
      <h2 style={{ marginBottom: '8px' }}>Asistente de Mostrador</h2>
      <p style={{ color: '#666', marginBottom: '16px', fontSize: '0.9rem' }}>
        Ingresá las preferencias o la consulta del cliente. Gemini generará las recomendaciones y se cruzará el stock en tiempo real con la base de datos legacy.
      </p>

      {/* Cliente rápido (modal) */}
      <div style={{ marginBottom: '16px' }}>
        <button type="button" onClick={() => setShowClienteRapido(true)} style={{ padding: '8px 14px', background: '#2196f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Cliente rápido</button>
        {clientes.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <SearchSelect
              options={clientes.map(c => ({ value: c.id_cliente, label: `${c.nombre} - ${c.email || ''}` }))}
              value={clienteSeleccionado}
              onChange={(v) => setClienteSeleccionado(v)}
              placeholder="Cliente para pedido..."
            />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: Cliente busca novelas policiales ambientadas en la Patagonia..."
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.95rem', resize: 'vertical', boxSizing: 'border-box', marginBottom: '8px' }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            style={{ padding: '10px 20px', backgroundColor: loading ? '#9e9e9e' : '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Seleccionando propuesta y verificando stock...' : 'Buscar Recomendaciones'}
          </button>
          {(res.en_stock.length > 0 || res.a_pedir.length > 0) && (
            <button type="button" onClick={limpiarResultado} style={{ padding: '10px 16px', backgroundColor: '#757575', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.95rem', cursor: 'pointer' }}>Limpiar</button>
          )}
        </div>
      </form>

      {error && <div style={{ padding: '12px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '16px' }}><strong>Error:</strong> {error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: (res.a_pedir.length > 0 && !isMobile) ? '1fr 1fr' : '1fr', gap: '20px', alignItems: 'start' }}>
        <div>
          <h3 style={{ color: '#2e7d32', borderBottom: '2px solid #2e7d32', paddingBottom: '8px' }}>En Stock ({res.en_stock.length})</h3>
          {res.en_stock.length === 0 && !loading && <p style={{ color: '#999', fontStyle: 'italic', fontSize: '0.9rem' }}>Sin resultados en stock local.</p>}
          {res.en_stock.map((libro, index) => (
            <RecomendacionCard key={`stock-${index}`} libro={libro} tipo="en_stock" onAltaRapida={onSeleccionarParaPedido} clienteId={clienteSeleccionado} />
          ))}
        </div>
        {res.a_pedir.length > 0 && (
          <div>
            <h3 style={{ color: '#ed6c02', borderBottom: '2px solid #ed6c02', paddingBottom: '8px' }}>A Pedir — sin stock ({res.a_pedir.length})</h3>
            <p style={{ color: '#888', fontSize: '0.8rem', margin: '4px 0 12px' }}>Ingresados al catálogo en los últimos 6 meses; probablemente pedibles al proveedor.</p>
            {res.a_pedir.map((libro, index) => (
              <RecomendacionCard key={`pedir-${index}`} libro={libro} tipo="a_pedir" onAltaRapida={onSeleccionarParaPedido} clienteId={clienteSeleccionado} />
            ))}
          </div>
        )}
      </div>

      {showClienteRapido && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowClienteRapido(false)}>
          <div className="modal-card" style={{ background: '#fff', borderRadius: '8px', padding: '20px', width: '360px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>+ Cliente rápido</h3>
            <input placeholder="Nombre *" value={nuevoCliente.nombre} onChange={e=>setNuevoCliente({...nuevoCliente, nombre:e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box' }} />
            <input placeholder="Email" value={nuevoCliente.email} onChange={e=>setNuevoCliente({...nuevoCliente, email:e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box' }} />
            <input placeholder="Teléfono" value={nuevoCliente.telefono} onChange={e=>setNuevoCliente({...nuevoCliente, telefono:e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '12px', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowClienteRapido(false)} style={{ padding: '8px 14px', cursor: 'pointer' }}>Cancelar</button>
              <button type="button" onClick={handleAltaClienteRapida} style={{ background: '#2196f3', color: '#fff', padding: '8px 14px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsistenteBlock;