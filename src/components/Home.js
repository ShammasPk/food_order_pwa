import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import menuItems from '../data/menuItems.json';
import { FaShoppingCart, FaSignOutAlt, FaChevronRight, FaStar, FaPlus, FaBars, FaTimes } from 'react-icons/fa';

// Sample offer images
const offerImages = [
  'https://placehold.co/350x200',
  'https://placehold.co/350x200',
  'https://placehold.co/350x200'
];

const Home = ({ cart, addToCart, removeFromCart, user }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [topPicks] = useState(menuItems.slice(0, 10)); // First 10 items as top picks
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  // Auto-rotate slider
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % offerImages.length);
    }, 3000);
    return () => clearInterval(interval);
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

  const handleAddToCart = (item, e) => {
    e.stopPropagation();
    addToCart(item);
  };

  return (
    <div className="mobile-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <div className="logo">FDPWA</div>
          <div className="header-actions">
            <button
              className="cart-icon"
              onClick={() => navigate('/checkout')}
              disabled={cart.length === 0}
              aria-label="View cart"
            >
              <FaShoppingCart />
              {getTotalItems() > 0 && (
                <span className="cart-count">{getTotalItems()}</span>
              )}
            </button>
          </div>
        </div>
        <div className="location-bar">
          <span>Deliver to: {user?.address || 'Select Address'}</span>
          <FaChevronRight size={12} />
        </div>
        
        {/* Navigation Menu Overlay */}
        <div 
          className={`nav-overlay ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Navigation Menu */}
        <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          <nav>
            <ul>
              <li><Link to="/home" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
              <li><Link to="/menu" onClick={() => setIsMenuOpen(false)}>Menu</Link></li>
              <li><Link to="/offers" onClick={() => setIsMenuOpen(false)}>Offers</Link></li>
              <li><Link to="/orders" onClick={() => setIsMenuOpen(false)}>My Orders</Link></li>
              <li>
                <button onClick={handleLogout} className="logout-btn-nav">
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="home-content">
        {/* Offers Slider */}
        <div className="offers-slider" ref={sliderRef}>
          <div 
            className="slider-track"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {offerImages.map((img, index) => (
              <div key={index} className="slide">
                <img src={img} alt={`Offer ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="slider-dots">
            {offerImages.map((_, index) => (
              <span 
                key={index} 
                className={`dot ${index === activeSlide ? 'active' : ''}`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Top Picks Section */}
        <section className="top-picks">
          <h2>Top Picks For You</h2>
          <div className="food-grid">
            {topPicks.map((item) => {
              const quantity = getCartItemQuantity(item.id);
              return (
                <div 
                  key={item.id} 
                  className="food-card"
                  onClick={() => navigate(`/item/${item.id}`)}
                >
                  <div className="food-image-container">
                    <img 
                      src={item.image || '/images/placeholder-food.svg'} 
                      alt={item.name}
                      className="food-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/placeholder-food.svg';
                      }}
                    />
                    <div className={`veg-indicator ${item.veg ? 'veg' : 'non-veg'}`}></div>
                    {item.bestseller && <div className="bestseller-tag">Bestseller</div>}
                    <div className="rating-badge">
                      <FaStar className="star-icon" />
                      <span>{item.rating || '4.0'}</span>
                    </div>
                  </div>
                  <div className="food-details">
                    <h3>{item.name}</h3>
                    <p className="description">{item.description}</p>
                    <div className="price-row">
                      <span className="price">₹{item.price}</span>
                      {quantity > 0 ? (
                        <div className="quantity-controls" onClick={(e) => e.stopPropagation()}>
                          <button 
                            className="quantity-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(item.id);
                            }}
                          >
                            -
                          </button>
                          <span className="quantity">{quantity}</span>
                          <button 
                            className="quantity-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(item);
                            }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="add-btn"
                          onClick={(e) => handleAddToCart(item, e)}
                        >
                          <FaPlus /> ADD
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* View Menu Button */}
        <div className="view-menu-btn-container">
          <Link to="/menu" className="view-menu-btn">
            View Full Menu <FaChevronRight />
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
