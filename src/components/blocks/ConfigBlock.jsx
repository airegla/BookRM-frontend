// ARCHIVO: ConfigBlock.jsx
// RUTA: frontend/src/components/blocks/ConfigBlock.jsx
// DESCRIPCIÓN: Vista Config editable que usa empresa_config (edición en modal).

import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import DebugTag from '../../ui/DebugTag';

export const ConfigBlock = () => {
  const [cfg, setCfg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => { api.getEmpresaConfig().then(setCfg).finally(() => setLoading(false)); }, []);

  const handleSave = async () => {
    try {
      const updated = await api.updateEmpresaConfig(cfg);
      setCfg(updated);
      setMsg('✅ Config guardada');
      setEditing(false);
    } catch (e) { setMsg('❌ ' + e.message); }
  };

  if (loading) return <p>Cargando config...</p>;
  if (!cfg) return <p>Sin config</p>;

  const campo = (label, valor) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
      <span style={{ color: '#555' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{valor || '—'}</span>
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <DebugTag name="ConfigBlock.jsx" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>⚙️ Configuración Empresa</h2>
        <button onClick={() => { setMsg(null); setEditing(true); }} style={{ padding: '8px 14px', background: '#1a237e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✏️ Editar</button>
      </div>
      {msg && <div style={{ padding: '8px', background: '#e8f5e9', borderRadius: '4px', margin: '12px 0' }}>{msg}</div>}
      <div style={{ background: '#fff', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
        {campo('Nombre empresa', cfg.nombre_empresa)}
        {campo('Email control (bandeja aprobación)', cfg.email_control)}
        {campo('Email compras', cfg.email_compras)}
        {campo('Telegram Chat ID', cfg.telegram_chat_id)}
        {campo('Telegram Bot Token', cfg.telegram_bot_token)}
        {campo('WhatsApp Phone ID', cfg.whatsapp_phone_id)}
        {campo('Umbral editorial default', cfg.umbral_editorial_default)}
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setEditing(false)}>
          <div style={{ background: '#fff', borderRadius: '8px', padding: '20px', width: '440px', maxHeight: '82vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Editar configuración</h3>
            <label style={{ display: 'block', marginBottom: '10px' }}>Nombre empresa
              <input value={cfg.nombre_empresa} onChange={e => setCfg({...cfg, nombre_empresa: e.target.value})} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>Email control (bandeja aprobación)
              <input value={cfg.email_control} onChange={e => setCfg({...cfg, email_control: e.target.value})} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>Email compras
              <input value={cfg.email_compras} onChange={e => setCfg({...cfg, email_compras: e.target.value})} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>Telegram Chat ID (grupo trabajo)
              <input placeholder="-100123..." value={cfg.telegram_chat_id || ''} onChange={e => setCfg({...cfg, telegram_chat_id: e.target.value})} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>Telegram Bot Token
              <input placeholder="123456:ABC..." value={cfg.telegram_bot_token || ''} onChange={e => setCfg({...cfg, telegram_bot_token: e.target.value})} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>WhatsApp Phone ID
              <input placeholder="123456..." value={cfg.whatsapp_phone_id || ''} onChange={e => setCfg({...cfg, whatsapp_phone_id: e.target.value})} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </label>
            <label style={{ display: 'block', marginBottom: '16px' }}>Umbral editorial default
              <input type="number" value={cfg.umbral_editorial_default} onChange={e => setCfg({...cfg, umbral_editorial_default: e.target.value})} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </label>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setEditing(false)} style={{ padding: '8px 14px', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleSave} style={{ background: '#1a237e', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 14px', cursor: 'pointer' }}>Guardar config</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};