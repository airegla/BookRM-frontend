// ARCHIVO: ProveedoresBlock.jsx
// RUTA: frontend/src/components/blocks/ProveedoresBlock.jsx
// DESCRIPCIÓN: Vista Proveedores - CRUD proveedores_config. Permite cambiar mail a donde enviar y mapear prv_id legacy.

import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';

export const ProveedoresBlock = () => {
  const [proveedores, setProveedores] = useState([]);
  const [form, setForm] = useState({ nombre: '', email: '', tipo: 'distribuidora', prv_id_legacy: '', umbral_editorial: 5 });
  const [error, setError] = useState(null);

  const cargar = async () => {
    try { setProveedores(await api.getProveedores()); } catch (e) { setError(e.message); }
  };
  useEffect(() => { cargar(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createProveedor({ ...form, prv_id_legacy: form.prv_id_legacy? parseInt(form.prv_id_legacy,10) : null, umbral_editorial: parseInt(form.umbral_editorial,10) });
      setForm({ nombre: '', email: '', tipo: 'distribuidora', prv_id_legacy: '', umbral_editorial: 5 });
      cargar();
    } catch (e) { setError(e.message); }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>🏢 Proveedores / Editoriales - Config mails</h2>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>Acá definís a dónde manda n8n. <strong>libreriaelmaltes@gmail.com</strong> es bandeja de aprobación. Si querés que Planeta vaya directo, cargalo como tipo editorial.</p>
      {error && <div style={{ background: '#ffebee', padding: '8px', color: '#c62828', borderRadius: '4px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto', gap: '8px', margin: '16px 0', background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
        <input placeholder="Nombre (Galerna, Planeta)" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required style={{ padding: '6px' }} />
        <input placeholder="Email proveedor" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{ padding: '6px' }} />
        <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} style={{ padding: '6px' }}><option value="distribuidora">distribuidora</option><option value="editorial">editorial</option></select>
        <input placeholder="prv_id legacy (opcional)" value={form.prv_id_legacy} onChange={e => setForm({...form, prv_id_legacy: e.target.value})} style={{ padding: '6px' }} />
        <input placeholder="Umbral" type="number" value={form.umbral_editorial} onChange={e => setForm({...form, umbral_editorial: e.target.value})} style={{ padding: '6px' }} />
        <button type="submit" style={{ background: '#1a237e', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px' }}>Agregar</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', background: '#fff' }}>
        <thead><tr style={{ background: '#e0e0e0' }}><th style={{ padding: '8px', textAlign: 'left' }}>ID</th><th>Nombre</th><th>Email</th><th>Tipo</th><th>prv_legacy</th><th>Umbral</th><th>Acción</th></tr></thead>
        <tbody>{proveedores.map(p => (
          <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px' }}>{p.id}</td><td style={{ padding: '8px', fontWeight: 600 }}>{p.nombre}</td><td style={{ padding: '8px' }}>{p.email}</td><td style={{ padding: '8px' }}>{p.tipo}</td><td style={{ padding: '8px' }}>{p.prv_id_legacy || '-'}</td><td style={{ padding: '8px' }}>{p.umbral_editorial}</td>
            <td style={{ padding: '8px' }}><button onClick={async () => { if(confirm('Borrar?')) { await api.deleteProveedor(p.id); cargar(); } }} style={{ fontSize: '0.75rem', background: '#c62828', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px' }}>Borrar</button></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
};