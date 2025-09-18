import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaChevronLeft } from 'react-icons/fa';
import menuItems from '../data/menuItems.json';

const Menu = ({ cart, addToCart, removeFromCart, user }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [quantity, setQuantity] = useState({});
  const navigate = useNavigate();
  const categoryRefs = useRef({});
  const menuContainerRef = useRef(null);

  // Group items by category
  const categories = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Filter items based on search query
  const filteredCategories = Object.entries(categories).reduce((acc, [category, items]) => {
    const filteredItems = items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredItems.length > 0) {
      acc[category] = filteredItems;
    }
    return acc;
  }, {});

  // Set first category as active by default
  useEffect(() => {
    if (Object.keys(filteredCategories).length > 0 && !activeCategory) {
      setActiveCategory(Object.keys(filteredCategories)[0]);
    }
  }, [filteredCategories]);

  // Handle scroll to update active category
  useEffect(() => {
    const handleScroll = () => {
      if (!menuContainerRef.current) return;
      
      const scrollPosition = menuContainerRef.current.scrollTop + 100; // Offset for header
      
      // Find which category is currently in view
      for (const [category, ref] of Object.entries(categoryRefs.current)) {
        if (!ref) continue;
        
        const element = ref;
        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;
        
        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          setActiveCategory(category);
          break;
        }
      }
    };

    const menuContainer = menuContainerRef.current;
    if (menuContainer) {
      menuContainer.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (menuContainer) {
        menuContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [filteredCategories]);

  const scrollToCategory = (category) => {
    setActiveCategory(category);
    categoryRefs.current[category]?.scrollIntoView({ behavior: 'smooth' });
  };

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
    <div className="menu-page">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <FaChevronLeft />
          </button>
          <h1 className="page-title">Menu</h1>
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
      </header>
      
      {/* Menu Container */}
      <div className="menu-container">
        {/* Category Navigation */}
        <div className="category-nav">
          {Object.keys(filteredCategories).map((category) => (
            <button
              key={category}
              className={`category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => scrollToCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Menu Items */}
        <div className="menu-items" ref={menuContainerRef}>
          {Object.entries(filteredCategories).map(([category, items]) => (
            <div 
              key={category} 
              className="category-section"
              ref={el => categoryRefs.current[category] = el}
            >
              <h2 className="category-title">{category}</h2>
              
              {items.map((item) => {
                const itemQuantity = getCartItemQuantity(item.id);
                
                return (
                  <div key={item.id} className="menu-item">
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="price">₹{item.price}</p>
                      <p className="description">{item.description}</p>
                      
                      {item.customizable && (
                        <p className="customizable">Customizable</p>
                      )}
                      
                      {item.bestseller && (
                        <div className="bestseller-badge">Bestseller</div>
                      )}
                    </div>
                    
                    <div className="item-image-container">
                      <div className={`veg-indicator ${item.veg ? 'veg' : 'non-veg'}`}></div>
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="item-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/placeholder-food.svg';
                          }}
                        />
                      ) : (
                        <div className="image-placeholder">
                          <span>No Image</span>
                        </div>
                      )}
                      
                      {itemQuantity > 0 ? (
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(item.id);
                            }}
                          >
                            −
                          </button>
                          <span className="quantity">{itemQuantity}</span>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                        >
                          ADD
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Cart Summary Bar */}
      {getTotalItems() > 0 && (
        <div className="cart-summary-bar" onClick={() => navigate('/checkout')}>
          <div className="cart-count">
            <span className="count">{getTotalItems()}</span>
            <span>ITEMS</span>
          </div>
          <div className="view-cart">
            View Cart
          </div>
          <div className="total-amount">
            ₹{cart.reduce((total, item) => total + (item.price * item.quantity), 0)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
