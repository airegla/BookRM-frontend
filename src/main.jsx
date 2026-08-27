// ARCHIVO: main.jsx
// RUTA: frontend/src/main.jsx
// DESCRIPCIÓN: Inicializador de React DOM para la aplicación BOOK(RM).

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';
import './styles/app.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);