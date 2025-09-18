import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import menuItems from '../data/menuItems.json';

const ItemDetail = ({ cart, addToCart, removeFromCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const itemId = Number(id);
  const item = menuItems.find(i => Number(i.id) === itemId);

  const quantity = cart.find(ci => ci.id === itemId)?.quantity || 0;

  if (!item) {
    return (
      <div className="menu-page">
        <header className="header">
          <div className="header-content">
            <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
              <FaChevronLeft />
            </button>
            <h1 className="page-title">Item Not Found</h1>
          </div>
        </header>
        <main className="home-content" style={{ textAlign: 'center' }}>
          <p>Sorry, we couldn't find this item.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <header className="header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
            <FaChevronLeft />
          </button>
          <h1 className="page-title">{item.name}</h1>
        </div>
      </header>

      <main className="home-content" style={{ maxWidth: 600, margin: '0 auto', padding: '0 10px' }}>
        <div className="food-card" style={{ cursor: 'default' }}>
          <div className="food-image-container" style={{ paddingBottom: '56.25%' }}>
            <img
              src={item.image || '/images/placeholder-food.svg'}
              alt={item.name}
              className="food-image"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/placeholder-food.svg';
              }}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="food-details" style={{ padding: '12px 10px' }}>
            <h3 style={{ whiteSpace: 'normal' }}>{item.name}</h3>
            <p className="description">{item.description}</p>
            <div className="price-row">
              <span className="price">₹{item.price}</span>
              {quantity > 0 ? (
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => removeFromCart(itemId)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="quantity">{quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => addToCart(item)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="add-btn"
                  onClick={() => addToCart(item)}
                  aria-label="Add to cart"
                >
                  ADD
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ItemDetail;
