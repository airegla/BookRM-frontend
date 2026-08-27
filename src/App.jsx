// ARCHIVO: App.jsx
// RUTA: frontend/src/App.jsx
// DESCRIPCIÓN: App final 6 pestañas: Asistente, Pedidos, Radar/Avisos, Proveedores, Config, Clientes.

import React, { useState } from 'react';
import { AsistenteBlock } from './components/blocks/AsistenteBlock';
import { ClienteBlock } from './components/blocks/ClienteBlock';
import { PedidoBlock } from './components/blocks/PedidoBlock';
import { RadarBlock } from './components/blocks/RadarBlock';
import { ProveedoresBlock } from './components/blocks/ProveedoresBlock';
import { ConfigBlock } from './components/blocks/ConfigBlock';

export function App() {
  const [tabActiva, setTabActiva] = useState('asistente');
  const [libroSel, setLibroSel] = useState(null);

  const handleSel = (libro) => { setLibroSel(libro); setTabActiva('pedidos'); };
  const clear = () => setLibroSel(null);
  const eanPrecarga = (libroSel?.ean13_legacy || libroSel?.EAN13 || '').toString().trim();

  const Tab = ({ id, label }) => (
    <button onClick={() => setTabActiva(id)} style={{ padding: '14px 14px', border: 'none', background: 'none', fontWeight: tabActiva===id?'bold':'normal', color: tabActiva===id?'#1a237e':'#666', borderBottom: tabActiva===id?'3px solid #1a237e':'3px solid transparent', cursor: 'pointer' }}>{label}{id==='pedidos' && libroSel? ' ●' : ''}</button>
  );

  return (
    <div style={{ fontFamily: 'system-ui', minHeight: '100vh', background: '#fafafa' }}>
      <header style={{ background: '#1a237e', color: '#fff', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
          <div><h1 style={{ margin: 0 }}>BOOK(RM)</h1><p style={{ margin: 0, fontSize: '0.8rem', color: '#c5cae9' }}>CRM Pocket & Asistente de Mostrador - El Maltés</p></div>
          <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.15)', padding: '4px 8px', borderRadius: '4px' }}>libreriaelmaltes@gmail.com</span>
        </div>
      </header>

      <nav style={{ background: '#fff', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '4px', padding: '0 16px', flexWrap: 'wrap' }}>
          <Tab id="asistente" label="🤖 Asistente" />
          <Tab id="pedidos" label="📦 Pedidos" />
          <Tab id="radar" label="📨 Radar / Avisos" />
          <Tab id="proveedores" label="🏢 Proveedores" />
          <Tab id="config" label="⚙️ Config" />
          <Tab id="clientes" label="👥 Clientes" />
        </div>
      </nav>

      {libroSel && tabActiva==='pedidos' && (
        <div style={{ background: '#e3f2fd', padding: '10px 24px', borderBottom: '1px solid #bbdefb' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#0d47a1' }}>
            <span>💡 "{libroSel.Titulo}" - EAN13: <b style={{ fontFamily: 'monospace' }}>{eanPrecarga || 'sin EAN'}</b></span>
            <button onClick={clear} style={{ fontSize: '0.75rem' }}>Descartar</button>
          </div>
        </div>
      )}

      <main style={{ paddingBottom: '40px' }}>
        {tabActiva==='asistente' && <AsistenteBlock onSeleccionarParaPedido={handleSel} />}
        {tabActiva==='pedidos' && <PedidoBlock libroPrecargado={libroSel} onClearPrecarga={clear} />}
        {tabActiva==='radar' && <RadarBlock />}
        {tabActiva==='proveedores' && <ProveedoresBlock />}
        {tabActiva==='config' && <ConfigBlock />}
        {tabActiva==='clientes' && <ClienteBlock />}
      </main>
    </div>
  );
}
export default App;