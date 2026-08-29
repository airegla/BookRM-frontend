// ARCHIVO: App.jsx
// RUTA: frontend/src/App.jsx
// DESCRIPCIÓN: App con pestañas. En mobile usa navegación inferior fija; en desktop tabs superiores.

import React, { useState } from 'react';
import { AsistenteBlock } from './components/blocks/AsistenteBlock';
import { ClienteBlock } from './components/blocks/ClienteBlock';
import { PedidoBlock } from './components/blocks/PedidoBlock';
import { RadarBlock } from './components/blocks/RadarBlock';
import { ProveedoresBlock } from './components/blocks/ProveedoresBlock';
import { ConfigBlock } from './components/blocks/ConfigBlock';
import { UsuariosBlock } from './components/blocks/UsuariosBlock';
import { PropuestasBlock } from './components/blocks/PropuestasBlock';
import { LogsBlock } from './components/blocks/LogsBlock';
import { Login } from './components/Login';
import { api, getUser, getToken, setToken, setUser } from './api/api';
import { useIsMobile } from './hooks/useIsMobile';

export function App() {
  const [tabActiva, setTabActiva] = useState('asistente');
  const [libroSel, setLibroSel] = useState(null);
  const [user, setUserState] = useState(() => getUser());
  const [loggedIn, setLoggedIn] = useState(() => !!getToken());
  const [moreOpen, setMoreOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleLogin = (data) => {
    setToken(data.token);
    setUser(data.user);
    setUserState(data.user);
    setLoggedIn(true);
    setTabActiva('asistente');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setUserState(null);
    setLoggedIn(false);
    setLibroSel(null);
    setMoreOpen(false);
  };

  if (!loggedIn) return <Login onLogin={handleLogin} />;

  const handleSel = (libro) => { setLibroSel(libro); setTabActiva('pedidos'); };
  const clear = () => setLibroSel(null);
  const eanPrecarga = (libroSel?.ean13_legacy || libroSel?.EAN13 || '').toString().trim();

  const Tab = ({ id, label }) => (
    <button onClick={() => setTabActiva(id)} style={{ padding: '14px 14px', border: 'none', background: 'none', fontWeight: tabActiva===id?'bold':'normal', color: tabActiva===id?'#1a237e':'#666', borderBottom: tabActiva===id?'3px solid #1a237e':'3px solid transparent', cursor: 'pointer' }}>{label}{id==='pedidos' && libroSel? ' ●' : ''}</button>
  );

  const mobileTabs = [
    { id: 'asistente', icon: '🤖', label: 'Asistente' },
    { id: 'pedidos', icon: '📦', label: 'Pedidos' },
    { id: 'clientes', icon: '👥', label: 'Clientes' },
    { id: 'proveedores', icon: '🏢', label: 'Proveed.' }
  ];

  const extraTabs = [
    { id: 'radar', icon: '📨', label: 'Radar / Avisos' },
    { id: 'propuestas', icon: '📚', label: 'Propuestas' },
    { id: 'config', icon: '⚙️', label: 'Configuración' },
    ...(user?.rol === 'admin' ? [{ id: 'usuarios', icon: '👤', label: 'Usuarios' }, { id: 'logs', icon: '📋', label: 'Logs' }] : [])
  ];

  const NavButton = ({ id, icon, label }) => (
    <button
      onClick={() => { setTabActiva(id); setMoreOpen(false); }}
      style={{ flex: 1, padding: '8px 2px 6px', background: 'none', border: 'none', color: tabActiva===id && !moreOpen ? '#1a237e' : '#666', fontWeight: tabActiva===id && !moreOpen ? 'bold' : 'normal', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
    >
      <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{icon}</span>
      <span style={{ fontSize: '0.6rem' }}>{label}</span>
    </button>
  );

  return (
    <div style={{ fontFamily: 'system-ui', minHeight: '100vh', background: '#fafafa' }}>
      <header style={{ background: '#1a237e', color: '#fff', padding: isMobile ? '10px 14px' : '16px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? '1.1rem' : '1.5rem' }}>BOOK(RM)</h1>
            {!isMobile && <p style={{ margin: 0, fontSize: '0.8rem', color: '#c5cae9' }}>CRM Pocket & Asistente de Mostrador - El Maltés</p>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.15)', padding: '4px 8px', borderRadius: '4px' }}>{user?.nombre || user?.usuario}</span>
            <button onClick={handleLogout} style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>Salir</button>
          </div>
        </div>
      </header>

      {!isMobile && (
        <nav style={{ background: '#fff', borderBottom: '1px solid #e0e0e0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '4px', padding: '0 16px', flexWrap: 'wrap' }}>
            <Tab id="asistente" label="🤖 Asistente" />
            <Tab id="pedidos" label="📦 Pedidos" />
            <Tab id="radar" label="📨 Radar / Avisos" />
            <Tab id="propuestas" label="📚 Propuestas" />
            <Tab id="proveedores" label="🏢 Proveedores" />
            <Tab id="config" label="⚙️ Config" />
            <Tab id="clientes" label="👥 Clientes" />
            {user?.rol === 'admin' && <Tab id="usuarios" label="👤 Usuarios" />}
            {user?.rol === 'admin' && <Tab id="logs" label="📋 Logs" />}
          </div>
        </nav>
      )}

      {libroSel && tabActiva==='pedidos' && (
        <div style={{ background: '#e3f2fd', padding: '10px 14px', borderBottom: '1px solid #bbdefb' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#0d47a1' }}>
            <span>💡 "{libroSel.Titulo}" - EAN13: <b style={{ fontFamily: 'monospace' }}>{eanPrecarga || 'sin EAN'}</b></span>
            <button onClick={clear} style={{ fontSize: '0.75rem' }}>Descartar</button>
          </div>
        </div>
      )}

      <main style={{ padding: isMobile ? '14px 0 84px' : '0 0 40px' }}>
        {/* El Asistente se mantiene montado para no perder la búsqueda al cambiar de pestaña. */}
        <div style={{ display: tabActiva==='asistente' ? 'block' : 'none' }}>
          <AsistenteBlock onSeleccionarParaPedido={handleSel} />
        </div>
        {tabActiva==='pedidos' && <PedidoBlock libroPrecargado={libroSel} onClearPrecarga={clear} />}
        {tabActiva==='radar' && <RadarBlock />}
        {tabActiva==='propuestas' && <PropuestasBlock />}
        {tabActiva==='proveedores' && <ProveedoresBlock />}
        {tabActiva==='config' && <ConfigBlock />}
        {tabActiva==='usuarios' && <UsuariosBlock />}
        {tabActiva==='logs' && <LogsBlock />}
        {tabActiva==='clientes' && <ClienteBlock />}
      </main>

      {isMobile && (
        <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e0e0e0', display: 'flex', zIndex: 900, boxShadow: '0 -2px 8px rgba(0,0,0,0.08)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {mobileTabs.map(t => <NavButton key={t.id} {...t} />)}
          <button
            onClick={() => setMoreOpen(true)}
            style={{ flex: 1, padding: '8px 2px 6px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
          >
            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>⋯</span>
            <span style={{ fontSize: '0.6rem' }}>Más</span>
          </button>
        </nav>
      )}

      {isMobile && moreOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 950 }} onClick={() => setMoreOpen(false)}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', borderRadius: '16px 16px 0 0', padding: '8px 12px calc(12px + env(safe-area-inset-bottom))' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', color: '#999', padding: '6px 0 2px', fontSize: '0.75rem' }}>Más opciones</div>
            {extraTabs.map(t => (
              <button key={t.id} onClick={() => { setTabActiva(t.id); setMoreOpen(false); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '14px 8px', background: 'none', border: 'none', borderBottom: '1px solid #f0f0f0', fontSize: '1rem', cursor: 'pointer' }}>
                {t.icon} {t.label}
              </button>
            ))}
            <button onClick={() => setMoreOpen(false)} style={{ display: 'block', width: '100%', padding: '12px', background: '#f5f5f5', border: 'none', borderRadius: '8px', marginTop: '8px', cursor: 'pointer' }}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;