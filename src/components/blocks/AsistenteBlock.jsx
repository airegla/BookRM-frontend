// ARCHIVO: AsistenteBlock.jsx
// RUTA: frontend/src/components/AsistenteBlock.jsx

import { useState, useEffect } from 'react';
import { api } from '../../api/api.js';

export function AsistenteBlock() {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState(null);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre:'', email:'', telefono:'' });

  useEffect(()=>{ cargarClientes(); }, []);
  const cargarClientes = async () => {
    const data = await api.getClientes();
    setClientes(data);
  };

  const handleAltaClienteRapida = async () => {
    if(!nuevoCliente.nombre) return alert('Nombre requerido');
    try {
      const cli = await api.createCliente(nuevoCliente);
      // el backend devuelve {id_cliente, nombre...} o el objeto directo
      const cliReal = cli.id_cliente ? cli : cli.data || cli;
      setClientes(prev=>[...prev, cliReal]);
      setClienteSeleccionado(cliReal.id_cliente);
      setNuevoCliente({ nombre:'', email:'', telefono:'' });
      alert(`Cliente ${cliReal.nombre} creado`);
    } catch(e) {
      alert('Error: '+e.message);
    }
  };

  const handleRecomendar = async () => {
    const data = await api.recomendar(prompt);
    setResultado(data);
  };

  return (
    <div style={{padding:'12px'}}>
      {/* ALTA RAPIDA CLIENTE */}
      <div style={{border:'1px solid #ddd', padding:'10px', marginBottom:'12px', borderRadius:'8px', background:'#fafafa'}}>
        <strong>+ Cliente rápido (sin salir de Asistente)</strong>
        <div style={{display:'flex', gap:'6px', marginTop:'6px'}}>
          <input placeholder="Nombre *" value={nuevoCliente.nombre} onChange={e=>setNuevoCliente({...nuevoCliente, nombre:e.target.value})} style={{flex:1, padding:'6px'}}/>
          <input placeholder="Email" value={nuevoCliente.email} onChange={e=>setNuevoCliente({...nuevoCliente, email:e.target.value})} style={{flex:1, padding:'6px'}}/>
          <input placeholder="Tel" value={nuevoCliente.telefono} onChange={e=>setNuevoCliente({...nuevoCliente, telefono:e.target.value})} style={{flex:0.8, padding:'6px'}}/>
          <button onClick={handleAltaClienteRapida} style={{background:'#2196f3', color:'#fff', padding:'6px 12px', border:'none', borderRadius:'4px', cursor:'pointer'}}>Guardar</button>
        </div>
      </div>

      <select value={clienteSeleccionado} onChange={e=>setClienteSeleccionado(e.target.value)} style={{width:'100%', padding:'8px', marginBottom:'8px'}}>
        <option value="">Seleccioná cliente...</option>
        {clientes.map(c=><option key={c.id_cliente} value={c.id_cliente}>{c.nombre} - {c.email}</option>)}
      </select>

      <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Ej: cliente busca libro de harry potter..." style={{width:'100%', height:'80px', padding:'8px'}}/>
      <button onClick={handleRecomendar} style={{marginTop:'8px', padding:'8px 16px'}}>Recomendar</button>

      {resultado && <pre style={{marginTop:'12px', background:'#f5f5f5', padding:'8px'}}>{JSON.stringify(resultado, null, 2)}</pre>}
    </div>
  );
}