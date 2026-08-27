// ARCHIVO: useAsistente.js
// RUTA: frontend/src/hooks/useAsistente.js
// DESCRIPCIÓN: Hook personalizado para gestionar las solicitudes al Asistente y la clasificación en_stock / a_pedir.

import { useState } from 'react';
import { api } from '../api/api';

export const useAsistente = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState({ en_stock: [], a_pedir: [] });

  const consultarAsistente = async (prompt) => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await api.recomendar(prompt);
      setResultado(data);
    } catch (err) {
      console.error('[useAsistente] Error:', err);
      setError(err.message || 'Error al conectar con el asistente');
    } finally {
      setLoading(false);
    }
  };

  const limpiarResultado = () => {
    setResultado({ en_stock: [], a_pedir: [] });
    setError(null);
  };

  return {
    loading,
    error,
    resultado,
    consultarAsistente,
    limpiarResultado,
  };
};