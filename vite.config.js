// ARCHIVO: vite.config.js
// RUTA: frontend/vite.config.js
// DESCRIPCIÓN: Configuración de Vite para el entorno de desarrollo y compilación de React.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
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
});