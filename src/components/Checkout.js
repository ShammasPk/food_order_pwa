import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaChevronLeft, FaShoppingCart } from 'react-icons/fa';

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
      <div className="menu-page">
        <header className="header">
          <div className="header-content">
            <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
              <FaChevronLeft />
            </button>
            <h1 className="page-title">Cart</h1>
            <div className="header-actions" />
          </div>
        </header>

        <div className="empty-cart">
          <div className="empty-icon">
            <FaShoppingCart size={42} />
          </div>
          <h2 className="empty-title">Your Cart is Empty</h2>
          <p className="empty-sub">Browse the menu and add something tasty.</p>
          <div className="view-menu-btn-container">
            <button 
              className="view-menu-btn"
              onClick={() => navigate('/menu')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const delivery = 30;
  const tax = Math.round(getTotalAmount() * 0.05);
  const total = getTotalAmount() + delivery + tax;

  return (
    <div className="menu-page">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
            <FaChevronLeft />
          </button>
          <h1 className="page-title">Cart</h1>
          <div className="header-actions" />
        </div>
      </header>

      <div className="checkout-page">
        <div className="checkout-list">
          {cart.map(item => (
            <div key={item.id} className="checkout-card">
              <div className="checkout-left">
                <img
                  src={item.image || '/images/placeholder-food.svg'}
                  alt={item.name}
                  className="checkout-thumb"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder-food.svg'; }}
                />
              </div>
              <div className="checkout-center">
                <div className="checkout-title-row">
                  <h4 className="checkout-item-name">{item.name}</h4>
                  <button className="checkout-remove" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                    <FaTrash size={14} />
                  </button>
                </div>
                <div className="checkout-item-sub">{item.description}</div>
                <div className="checkout-actions">
                  <div className="qty-pill">
                    <button onClick={() => removeFromCart(item.id)} aria-label="Decrease" className="qty-btn">−</button>
                    <span className="qty-val">{getCartItemQuantity(item.id)}</span>
                    <button onClick={() => addToCart(item)} aria-label="Increase" className="qty-btn">＋</button>
                  </div>
                  <div className="checkout-price">₹{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="checkout-summary">
          <div className="summary-row"><span>Subtotal:</span><span>₹{getTotalAmount().toFixed(2)}</span></div>
          <div className="summary-row"><span>Delivery charge:</span><span>₹{delivery.toFixed(2)}</span></div>
          <div className="summary-row"><span>Tax:</span><span>₹{tax.toFixed(2)}</span></div>
          <div className="summary-divider" />
          <div className="summary-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>

          <div className="view-menu-btn-container">
            <button className="view-menu-btn" onClick={() => navigate('/delivery-address')}>Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
