// ARCHIVO: ConfigBlock.jsx
// RUTA: frontend/src/components/blocks/ConfigBlock.jsx
// DESCRIPCIÓN: Vista Config editable que usa empresa_config. Sin hardcodes.

import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';

export const ConfigBlock = () => {
  const [cfg, setCfg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => { api.getEmpresaConfig().then(setCfg).finally(() => setLoading(false)); }, []);

  const handleSave = async () => {
    try {
      const updated = await api.updateEmpresaConfig(cfg);
      setCfg(updated);
      setMsg('✅ Config guardada');
    } catch (e) { setMsg('❌ ' + e.message); }
  };

  if (loading) return <p>Cargando config...</p>;
  if (!cfg) return <p>Sin config</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>⚙️ Configuración Empresa</h2>
      {msg && <div style={{ padding: '8px', background: '#e8f5e9', borderRadius: '4px', marginBottom: '12px' }}>{msg}</div>}
      <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e0e0e0', display: 'grid', gap: '12px' }}>
        <label>Nombre empresa<input value={cfg.nombre_empresa} onChange={e => setCfg({...cfg, nombre_empresa: e.target.value})} style={{ width: '100%', padding: '6px' }} /></label>
        <label>Email control (bandeja aprobación)<input value={cfg.email_control} onChange={e => setCfg({...cfg, email_control: e.target.value})} style={{ width: '100%', padding: '6px' }} /></label>
        <label>Email compras<input value={cfg.email_compras} onChange={e => setCfg({...cfg, email_compras: e.target.value})} style={{ width: '100%', padding: '6px' }} /></label>
        <label>Telegram Chat ID (grupo trabajo)<input placeholder="-100123..." value={cfg.telegram_chat_id || ''} onChange={e => setCfg({...cfg, telegram_chat_id: e.target.value})} style={{ width: '100%', padding: '6px' }} /></label>
        <label>WhatsApp Phone ID<input placeholder="123456..." value={cfg.whatsapp_phone_id || ''} onChange={e => setCfg({...cfg, whatsapp_phone_id: e.target.value})} style={{ width: '100%', padding: '6px' }} /></label>
        <label>Umbral editorial default<input type="number" value={cfg.umbral_editorial_default} onChange={e => setCfg({...cfg, umbral_editorial_default: e.target.value})} style={{ width: '100%', padding: '6px' }} /></label>
        <button onClick={handleSave} style={{ background: '#1a237e', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px' }}>Guardar config</button>
        <p style={{ fontSize: '0.8rem', color: '#666' }}>Ahora n8n puede leer /api/empresa-config para saber email_control y nombre sin hardcodear.</p>
      </div>
    </div>
  );
};