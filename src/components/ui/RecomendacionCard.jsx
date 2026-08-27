// ARCHIVO: RecomendacionCard.jsx
// RUTA: frontend/src/components/ui/RecomendacionCard.jsx
// DESCRIPCIÓN: Tarjeta de recomendación. Muestra EAN13 (campo canónico del sistema) y botón para precargar pedido.

import React from 'react';

export const RecomendacionCard = ({ libro, tipo, onAltaRapida }) => {
  const esStock = tipo === 'en_stock';
  const ean = (libro.ean13_legacy || libro.EAN13 || libro.ean13 || libro.ISBN || '').toString().trim();

  return (
    <div style={{ border: `1px solid ${esStock? '#2e7d32' : '#ed6c02'}`, borderRadius: '8px', padding: '16px', marginBottom: '12px', backgroundColor: esStock? '#f1f8e9' : '#fff3e0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{libro.Titulo}</h4>
        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', color: '#fff', backgroundColor: esStock? '#2e7d32' : '#ed6c02' }}>{esStock? `Stock: ${libro.stock}` : 'A Pedir'}</span>
      </div>
      <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#555', fontStyle: 'italic' }}>{libro.Autor} — <span style={{ fontWeight: '600' }}>{libro.Editorial}</span></p>

      {ean && (
        <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', backgroundColor: '#fff', border: '1px dashed #999', padding: '4px 6px', borderRadius: '4px', display: 'inline-block' }}>
          <strong>EAN13:</strong> <span style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>{ean}</span>
        </p>
      )}

      {libro.db_titulo && <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', backgroundColor: 'rgba(0,0,0,0.04)', padding: '4px 6px', borderRadius: '4px' }}><strong>Match Legacy:</strong> {libro.db_titulo}</p>}

      <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem' }}>{libro.Resumen}</p>
      <div style={{ fontSize: '0.8rem', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '8px', marginTop: '8px' }}>
        <p style={{ margin: '0 0 4px 0' }}><strong>¿Por qué?:</strong> {libro.Justificacion}</p>
        <p style={{ margin: '0 0 4px 0', color: '#0288d1' }}><strong>Tip:</strong> {libro.Tip_Venta}</p>
        <p style={{ margin: '0', color: '#666' }}><strong>Proveedor:</strong> {libro.proveedor}</p>
      </div>

      {onAltaRapida && (
        <button onClick={() => onAltaRapida(libro)} style={{ marginTop: '12px', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px' }}>
          + Agregar a Pedidos {ean? `(EAN ${ean})` : ''}
        </button>
      )}
    </div>
  );
};