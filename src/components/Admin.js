import React, { useState, useEffect } from 'react';

const Admin = ({ orders, setOrders }) => {
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const ADMIN_PASSWORD = 'admin123'; // In production, use proper authentication

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem('foodApp_adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('foodApp_adminAuth', 'true');
      setAdminPassword('');
    } else {
      alert('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('foodApp_adminAuth');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const printOrder = (order) => {
    // Simulate PetPooja integration
    const printData = {
      orderId: order.id,
      customerMobile: order.userMobile,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      deliveryAddress: order.deliveryAddress,
      total: order.total,
      orderTime: order.orderTime,
      timestamp: order.timestamp
    };

    // Create a formatted print string
    const printContent = `
=================================
      FOOD DELIVERY ORDER
=================================
Order ID: ${printData.orderId}
Customer: ${printData.customerMobile}
Order Time: ${printData.orderTime}

ITEMS:
${printData.items.map(item => 
  `${item.name} x${item.quantity} - ₹${item.total}`
).join('\n')}

---------------------------------
Total Amount: ₹${printData.total}
---------------------------------

DELIVERY ADDRESS:
${printData.deliveryAddress}

=================================
    Thank you for your order!
=================================
    `;

    // In a real application, this would integrate with PetPooja API
    console.log('Printing order:', printContent);
    
    // For demo purposes, show the print content in an alert
    alert(`Order sent to printer!\n\nPrint Preview:\n${printContent}`);
    
    // Update order status to confirmed
    updateOrderStatus(order.id, 'confirmed');
  };

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">🔐 Admin Login</h1>
          <form onSubmit={handleAdminLogin}>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Demo password: admin123
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="admin-header">📋 Order Management</h1>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <h3>No orders yet</h3>
          <p>Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <div className="order-id">Order #{order.id}</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {new Date(order.timestamp).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Customer: {order.userMobile}
                  </div>
                </div>
                <span className={`order-status status-${order.status}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="order-items">
                <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>Items:</h4>
                {order.items.map(item => (
                  <div key={item.id} className="order-item">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong>Delivery Address:</strong>
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                  {order.deliveryAddress}
                </div>
              </div>

              <div className="order-total">
                Total: ₹{order.total}
              </div>

              <div className="order-actions">
                {order.status === 'pending' && (
                  <>
                    <button 
                      className="btn btn-success"
                      onClick={() => printOrder(order)}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    >
                      🖨️ Print & Confirm
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    >
                      Cancel
                    </button>
                  </>
                )}
                
                {order.status === 'confirmed' && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                  >
                    Mark as Delivered
                  </button>
                )}

                {order.status === 'delivered' && (
                  <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                    ✅ Delivered
                  </span>
                )}

                {order.status === 'cancelled' && (
                  <span style={{ color: '#dc3545', fontWeight: 'bold' }}>
                    ❌ Cancelled
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '10px' }}>
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>📊 Order Statistics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff6b6b' }}>
              {orders.length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Orders</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
              {orders.filter(o => o.status === 'delivered').length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Delivered</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc107' }}>
              {orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Active</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#17a2b8' }}>
              ₹{orders.reduce((sum, o) => sum + o.total, 0)}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
