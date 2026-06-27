import React, { useEffect } from 'react';
import './Account.css';

export default function Account() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="account-page" style={{ padding: '40px 45px 80px' }}>
      <header className="account-header" style={{ marginBottom: '40px', borderBottom: '1px solid #141414', paddingBottom: '15px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Mi Cuenta
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '6px' }}>
          Bienvenido de vuelta, Harold.
        </p>
      </header>

      <div className="account-container" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '50px' }}>
        <aside className="profile-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--paper)', border: '1px solid #141414', padding: '24px' }}>
            <h2 style={{ fontSize: '14px', textTransform: 'uppercase', marginBottom: '15px' }}>Detalles de Perfil</h2>
            <p style={{ fontSize: '13px', margin: '6px 0' }}>
              <strong>Nombre:</strong> Harold Cuba
            </p>
            <p style={{ fontSize: '13px', margin: '6px 0' }}>
              <strong>Email:</strong> harold@example.com
            </p>
            <p style={{ fontSize: '13px', margin: '6px 0' }}>
              <strong>Socio desde:</strong> Junio, 2026
            </p>
            <button
              className="add-to-cart-btn"
              style={{ width: '100%', marginTop: '15px', padding: '10px' }}
              onClick={() => alert('Cerrando sesión...')}
            >
              Cerrar Sesión
            </button>
          </div>

          <div style={{ background: 'var(--paper)', border: '1px solid #141414', padding: '24px' }}>
            <h2 style={{ fontSize: '14px', textTransform: 'uppercase', marginBottom: '15px' }}>Dirección de Envío</h2>
            <address style={{ fontSize: '13px', fontStyle: 'normal', lineHeight: '1.6' }}>
              Av. Larco 123, Dpto 402<br />
              Miraflores, Lima<br />
              Perú
            </address>
            <button
              style={{
                marginTop: '15px',
                background: 'transparent',
                border: '1px solid #141414',
                padding: '8px 12px',
                fontSize: '11px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                width: '100%',
              }}
              onClick={() => alert('Editar dirección')}
            >
              Editar Dirección
            </button>
          </div>
        </aside>

        <section className="orders-section">
          <h2 style={{ fontSize: '16px', textTransform: 'uppercase', marginBottom: '20px' }}>Historial de Pedidos</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ border: '1px solid #ddd', padding: '20px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px' }}>
                  Pedido <strong>#AZ-9824</strong>
                </span>
                <span style={{ fontSize: '12px', background: '#e6d6ff', padding: '2px 8px', borderRadius: '999px' }}>
                  Entregado
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>Fecha: 15 de Junio, 2026</p>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>Items: 1x Conjunto Ivory</p>
                </div>
                <strong style={{ fontSize: '14px' }}>S/ 180.70</strong>
              </div>
            </div>

            <div style={{ border: '1px solid #ddd', padding: '20px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px' }}>
                  Pedido <strong>#AZ-9510</strong>
                </span>
                <span style={{ fontSize: '12px', background: '#e6d6ff', padding: '2px 8px', borderRadius: '999px' }}>
                  Entregado
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>Fecha: 02 de Enero, 2026</p>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>Items: 1x Vestido Astra</p>
                </div>
                <strong style={{ fontSize: '14px' }}>S/ 277.20</strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
