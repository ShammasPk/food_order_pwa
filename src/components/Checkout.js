import React from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ cart, removeFromCart, addToCart, user }) => {
  const navigate = useNavigate();

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemQuantity = (itemId) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-container">
        <h2 className="checkout-title">Your Cart is Empty</h2>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/home')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <button 
            onClick={() => navigate('/home')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
          <div className="logo">Checkout</div>
          <div></div>
        </div>
      </header>

      <div className="checkout-container">
        <h2 className="checkout-title">Review Your Order</h2>

        <div className="cart-items">
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Order Items</h3>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img 
                src={item.image} 
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className={item.isVeg ? 'veg-indicator' : 'non-veg-indicator'}></span>
                  <h4 className="cart-item-name">{item.name}</h4>
                </div>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  {item.description}
                </p>
                <div className="cart-item-price">₹{item.price} each</div>
              </div>
              <div className="quantity-controls">
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
              </div>
              <div style={{ marginLeft: '1rem', fontWeight: 'bold', color: '#ff6b6b' }}>
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        <div className="total-section">
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal:</span>
              <span>₹{getTotalAmount()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Delivery Fee:</span>
              <span>₹30</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>GST (5%):</span>
              <span>₹{Math.round(getTotalAmount() * 0.05)}</span>
            </div>
            <hr style={{ margin: '1rem 0' }} />
          </div>
          
          <div className="total-amount">
            Total: ₹{getTotalAmount() + 30 + Math.round(getTotalAmount() * 0.05)}
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/delivery-address')}
            style={{ marginTop: '1rem' }}
          >
            Proceed to Delivery Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
