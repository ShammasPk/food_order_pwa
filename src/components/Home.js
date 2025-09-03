import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import menuItems from '../data/menuItems.json';

const Home = ({ cart, addToCart, removeFromCart, user }) => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load menu items (simulating API call)
    setItems(menuItems);
  }, []);

  const getCartItemQuantity = (itemId) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('foodApp_user');
    localStorage.removeItem('foodApp_cart');
    window.location.reload();
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">🍽️ Food Delivery</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Hi, {user.mobile}</span>
            <button 
              className="cart-icon"
              onClick={() => navigate('/checkout')}
              disabled={cart.length === 0}
            >
              🛒
              {getTotalItems() > 0 && (
                <span className="cart-count">{getTotalItems()}</span>
              )}
            </button>
            <button 
              onClick={handleLogout}
              style={{ 
                background: 'rgba(255,255,255,0.2)', 
                border: 'none', 
                color: 'white', 
                padding: '0.5rem', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container">
        <h2 style={{ textAlign: 'center', margin: '2rem 0', color: '#333' }}>
          Our Delicious Menu
        </h2>

        <div className="food-grid">
          {items.map(item => (
            <div key={item.id} className="food-card">
              <img 
                src={item.image} 
                alt={item.name}
                className="food-image"
              />
              <div className="food-content">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className={item.isVeg ? 'veg-indicator' : 'non-veg-indicator'}></span>
                  <h3 className="food-name">{item.name}</h3>
                </div>
                <p className="food-description">{item.description}</p>
                <div className="food-price">₹{item.price}</div>
                
                <div className="food-actions">
                  <div className="quantity-controls">
                    {getCartItemQuantity(item.id) > 0 ? (
                      <>
                        <button 
                          className="quantity-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          -
                        </button>
                        <span className="quantity-display">
                          {getCartItemQuantity(item.id)}
                        </span>
                        <button 
                          className="quantity-btn"
                          onClick={() => addToCart(item)}
                        >
                          +
                        </button>
                      </>
                    ) : (
                      <button 
                        className="btn btn-primary"
                        onClick={() => addToCart(item)}
                        disabled={!item.isAvailable}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                      >
                        {item.isAvailable ? 'Add to Cart' : 'Not Available'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div style={{ 
            position: 'fixed', 
            bottom: '20px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            zIndex: 1000
          }}>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/checkout')}
              style={{ 
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
              }}
            >
              View Cart ({getTotalItems()} items)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
