// ARCHIVO: api.js
// RUTA: frontend/src/api/api.js
// DESCRIPCIÓN: Wrapper final FIX - request corregido + export CSV

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_KEY = import.meta.env.VITE_API_KEY || '';

// URL pública de la tapa (endpoint público del backend).
export const getTapaUrl = (ean) => ean ? `${API_BASE}/tapas/${ean}` : '';

// --- token JWT (almacenado en localStorage) ---
export const getToken = () => { try { return localStorage.getItem('bookrm_token') || ''; } catch { return ''; } };
export const setToken = (t) => { try { t ? localStorage.setItem('bookrm_token', t) : localStorage.removeItem('bookrm_token'); } catch {} };
export const getUser = () => { try { return JSON.parse(localStorage.getItem('bookrm_user') || 'null'); } catch { return null; } };
export const setUser = (u) => { try { u ? localStorage.setItem('bookrm_user', JSON.stringify(u)) : localStorage.removeItem('bookrm_user'); } catch {} };

const buildHeaders = (extra = {}) => {
  const h = { 'Content-Type': 'application/json', ...extra };
  if (API_KEY) h['X-API-Key'] = API_KEY;
  const token = getToken();
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
};

const request = async (endpoint, options = {}) => {
  const { headers: optHeaders, ...rest } = options;
  const config = {
    ...rest,
    headers: buildHeaders(optHeaders)
  };
  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = text; }
  if (!response.ok) {
    throw new Error(data?.error || data?.detalle || `HTTP ${response.status} en ${endpoint}`);
  }
  return data;
};

const requestCsv = async (endpoint) => {
  const response = await fetch(`${API_BASE}${endpoint}`, { headers: buildHeaders() });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.text();
};

export const api = {
  // auth
  login: (usuario, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ usuario, password }) }),
  getMe: () => request('/auth/me'),

  // usuarios (admin)
  getUsuarios: () => request('/usuarios'),
  createUsuario: (data) => request('/usuarios', { method: 'POST', body: JSON.stringify(data) }),
  updateUsuario: (id, data) => request(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUsuario: (id) => request(`/usuarios/${id}`, { method: 'DELETE' }),

  getClientes: () => request('/clientes'),
  createCliente: (data) => request('/clientes', { method: 'POST', body: JSON.stringify(data) }),
  updateCliente: (id, data) => request(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCliente: (id) => request(`/clientes/${id}`, { method: 'DELETE' }),
  getHistorial: (id) => request(`/clientes/${id}/historial`),
  getTematicas: () => request('/tematicas'),

  getPedidos: () => request('/pedidos'),
  altaRapidaPedido: (data) => request('/pedidos/alta-rapida', { method: 'POST', body: JSON.stringify(data) }),
  updateEstadoPedido: (id, estado) => request(`/pedidos/${id}/estado`, { method: 'PUT', body: JSON.stringify({ estado }) }),
  updateEan13Pedido: (id, ean13_legacy) => request(`/pedidos/${id}/ean13`, { method: 'PUT', body: JSON.stringify({ ean13_legacy }) }),

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
  updateProveedor: (id, data) => request(`/proveedores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProveedor: (id) => request(`/proveedores/${id}`, { method: 'DELETE' }),

  getEmpresaConfig: () => request('/empresa-config'),
  updateEmpresaConfig: (data) => request('/empresa-config', { method: 'PUT', body: JSON.stringify(data) }),

  exportPendientesCsv: () => requestCsv('/export/pendientes'),
  exportRecomendacionesCsv: () => requestCsv('/export/recomendaciones'),
  exportPedidosCsv: (estado = '') => requestCsv('/export/pedidos?estado=' + encodeURIComponent(estado)),
  
  checkIngresos: () => request('/orquestador/check-ingresos', { method: 'POST' }),

  getPropuestas: () => request('/propuestas'),
  getPropuesta: (id) => request(`/propuestas/${id}`),
  getCandidatosPropuesta: (idCliente) => request(`/propuestas/candidatos/${idCliente}`),
  generarPropuesta: (idCliente) => request(`/propuestas/generar/${idCliente}`, { method: 'POST' }),
  enviarPropuesta: (id) => request(`/propuestas/${id}/enviar`, { method: 'POST' }),
  deletePropuesta: (id) => request(`/propuestas/${id}`, { method: 'DELETE' }),

  getLogs: (limite = 200) => request(`/logs?limite=${encodeURIComponent(limite)}`),
  clearLogs: () => request('/logs', { method: 'DELETE' }),
};