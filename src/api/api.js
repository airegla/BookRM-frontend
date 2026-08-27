// ARCHIVO: api.js
// RUTA: frontend/src/api/api.js
// DESCRIPCIÓN: Wrapper final FIX - request corregido + export CSV

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const request = async (endpoint, options = {}) => {
  const { headers: optHeaders,...rest } = options;
  const config = {
   ...rest,
    headers: { 'Content-Type': 'application/json',...(optHeaders || {}) }
  };
  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const text = await response.text();
  let data;
  try { data = text? JSON.parse(text) : {}; } catch { data = text; }
  if (!response.ok) {
    throw new Error(data?.error || data?.detalle || `HTTP ${response.status} en ${endpoint}`);
  }
  return data;
};

const requestCsv = async (endpoint) => {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.text();
};

export const api = {
  getClientes: () => request('/clientes'),
  createCliente: (data) => request('/clientes', { method: 'POST', body: JSON.stringify(data) }),
  updateCliente: (id, data) => request(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCliente: (id) => request(`/clientes/${id}`, { method: 'DELETE' }),

  getPedidos: () => request('/pedidos'),
  altaRapidaPedido: (data) => request('/pedidos/alta-rapida', { method: 'POST', body: JSON.stringify(data) }),
  updateEstadoPedido: (id, estado) => request(`/pedidos/${id}/estado`, { method: 'PUT', body: JSON.stringify({ estado }) }),

  recomendar: (prompt) => request('/asistente/recomendar', { method: 'POST', body: JSON.stringify({ prompt }) }),

  getConsolidados: () => request('/orquestador/consolidados'),
  getRadarIngresos: () => request('/orquestador/radar-ingresos'),
  getRecomendaciones: () => request('/orquestador/recomendaciones'),
  getPendientesAgrupados: () => request('/orquestador/pendientes-agrupados'),
  notificarIngreso: (id) => request(`/orquestador/notificar/${id}`, { method: 'POST' }),
  enviarControl: (grupo) => request('/orquestador/enviar-control', { method: 'POST', body: JSON.stringify(grupo) }),
  enviarProveedor: (grupo) => request('/orquestador/enviar-proveedor', { method: 'POST', body: JSON.stringify(grupo) }),
  enviarConsolidados: () => request('/orquestador/enviar-consolidados', { method: 'POST' }),

  getProveedores: () => request('/proveedores'),
  createProveedor: (data) => request('/proveedores', { method: 'POST', body: JSON.stringify(data) }),
  deleteProveedor: (id) => request(`/proveedores/${id}`, { method: 'DELETE' }),

  getEmpresaConfig: () => request('/empresa-config'),
  updateEmpresaConfig: (data) => request('/empresa-config', { method: 'PUT', body: JSON.stringify(data) }),

  exportPendientesCsv: () => requestCsv('/export/pendientes'),
  exportRecomendacionesCsv: () => requestCsv('/export/recomendaciones'),
  
  checkIngresos: () => request('/orquestador/check-ingresos', { method: 'POST' }),
};