// ARCHIVO: ClienteBlock.jsx
// RUTA: frontend/src/components/blocks/ClienteBlock.jsx
// DESCRIPCIÓN: Componente UI para alta, edición, listado y eliminación de clientes con sus temáticas de interés.

import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';

export const ClienteBlock = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    id_cliente: null,
    nombre: '',
    telefono: '',
    email: '',
    tematicasIds: ''
  });
  const [modoEdicion, setModoEdicion] = useState(false);

  const cargarClientes = async () => {
    setLoading(true);
    try {
      const data = await api.getClientes();
      setClientes(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    // Procesar IDs de temáticas separadas por coma
    const tematicasArray = formData.tematicasIds
      ? formData.tematicasIds.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id))
      : [];

    const payload = {
      nombre: formData.nombre,
      telefono: formData.telefono,
      email: formData.email,
      tematicasIds: tematicasArray
    };

    try {
      if (modoEdicion) {
        await api.updateCliente(formData.id_cliente, payload);
      } else {
        await api.createCliente(payload);
      }
      limpiarFormulario();
      cargarClientes();
    } catch (err) {
      setError(err.message || 'Error al guardar el cliente');
    }
  };

  const handleEditar = (cliente) => {
    setModoEdicion(true);
    setFormData({
      id_cliente: cliente.id_cliente,
      nombre: cliente.nombre || '',
      telefono: cliente.telefono || '',
      email: cliente.email || '',
      tematicasIds: cliente.tematicas ? cliente.tematicas.map(t => t.id_tematica).join(', ') : ''
    });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este cliente?')) return;
    try {
      await api.deleteCliente(id);
      cargarClientes();
    } catch (err) {
      setError(err.message || 'Error al eliminar cliente');
    }
  };

  const limpiarFormulario = () => {
    setModoEdicion(false);
    setFormData({ id_cliente: null, nombre: '', telefono: '', email: '', tematicasIds: '' });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Gestión de Clientes</h2>

      {error && (
        <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
        <h3>{modoEdicion ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="Nombre completo *"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="IDs de Temáticas de interés (ej: 1, 3, 5)"
            value={formData.tematicasIds}
            onChange={(e) => setFormData({ ...formData, tematicasIds: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {modoEdicion ? 'Actualizar Cliente' : 'Guardar Cliente'}
          </button>
          {modoEdicion && (
            <button type="button" onClick={limpiarFormulario} style={{ padding: '8px 16px', backgroundColor: '#757575', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla de Clientes */}
      {loading ? (
        <p>Cargando clientes...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#e0e0e0', borderBottom: '2px solid #ccc' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Nombre</th>
              <th style={{ padding: '10px' }}>Teléfono</th>
              <th style={{ padding: '10px' }}>Email</th>
              <th style={{ padding: '10px' }}>Temáticas</th>
              <th style={{ padding: '10px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id_cliente} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{c.id_cliente}</td>
                <td style={{ padding: '10px', fontWeight: '500' }}>{c.nombre}</td>
                <td style={{ padding: '10px' }}>{c.telefono || '-'}</td>
                <td style={{ padding: '10px' }}>{c.email || '-'}</td>
                <td style={{ padding: '10px' }}>
                  {c.tematicas && c.tematicas.length > 0
                    ? c.tematicas.map(t => t.tematica?.nombre_tematica || `ID:${t.id_tematica}`).join(', ')
                    : 'Ninguna'}
                </td>
                <td style={{ padding: '10px' }}>
                  <button onClick={() => handleEditar(c)} style={{ marginRight: '6px', padding: '4px 8px', cursor: 'pointer' }}>
                    Editar
                  </button>
                  <button onClick={() => handleEliminar(c.id_cliente)} style={{ padding: '4px 8px', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};