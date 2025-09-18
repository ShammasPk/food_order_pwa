import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Orders = ({ user, orders: ordersProp = [] }) => {
  const navigate = useNavigate();
  // Fallback to localStorage in case ordersProp is empty (e.g., page refresh)
  const stored = JSON.parse(localStorage.getItem('foodApp_orders') || '[]');
  const orders = ordersProp && ordersProp.length ? ordersProp : stored;

  return (
    <div className="menu-page">
      <header className="header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
            <FaChevronLeft />
          </button>
          <h1 className="page-title">My Orders</h1>
          <div />
        </div>
      </header>

      <div className="checkout-page" style={{ paddingTop: 25 }}>
        {(!orders || orders.length === 0) && (
          <div className="empty-cart">
            <div className="empty-icon">🧾</div>
            <h2 className="empty-title">No orders yet</h2>
            <p className="empty-sub">Browse the menu and place your first order.</p>
            <div className="view-menu-btn-container">
              <button className="view-menu-btn" onClick={() => navigate('/menu')}>Browse Menu</button>
            </div>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="checkout-list">
            {orders.slice().reverse().map((o) => (
              <div key={o.id} className="checkout-card">
                <div className="checkout-center" style={{ gridColumn: '1 / -1' }}>
                  <div className="checkout-title-row">
                    <h4 className="checkout-item-name">Order #{o.id}</h4>
                    <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>₹{o.total}</span>
                  </div>
                  <div className="checkout-item-sub" style={{ marginBottom: 6 }}>
                    {new Date(o.timestamp || o.orderTime || Date.now()).toLocaleString()}
                  </div>
                  <div className="checkout-actions">
                    <div className="qty-pill" style={{ background: '#fff', borderRadius: 10, padding: '6px 10px' }}>
                      <span style={{ fontWeight: 700 }}>{o.items?.reduce((t,i)=>t+i.quantity,0) || 0} items</span>
                    </div>
                    <button className="qty-btn" onClick={() => navigate('/home')} style={{ borderRadius: 20 }}>Reorder</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
