// ARCHIVO: vite.config.js
// RUTA: frontend/vite.config.js
// DESCRIPCIÓN: Configuración de Vite para el entorno de desarrollo y compilación de React.
//              base: ruta pública donde se sirve la app. En producción (VPS) la app vive bajo
//              /tecnozenit/, así que los assets deben compilarse con base=/tecnozenit/ (si no,
//              el index.html referencia /assets/* desde la raíz del dominio y dan 404).
//              Se puede sobreescribir con la variable VITE_BASE (ej. VITE_BASE=/ npm run build).

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE || '/tecnozenit/';
  return {
    base,
    plugins: [react()],
    server: {
      port: 5173, // Puerto por defecto de Vite
      open: true,  // Abre el navegador automáticamente al iniciar
      proxy: {
        // Opcional: Redirige las llamadas /api hacia el backend local para evitar problemas de CORS en dev
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        }
      }
    }
  };
});