import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const offers = [
  { id: 1, title: 'Flat 20% OFF on first order', desc: 'Use code WELCOME20 at checkout', color: '#fff5ef' },
  { id: 2, title: 'Free Delivery above ₹499', desc: 'No delivery charge for orders above ₹499', color: '#eef9ff' },
  { id: 3, title: 'Combo Deals', desc: 'Save more on handpicked combos', color: '#f5f7ff' },
];

const Offers = () => {
  const navigate = useNavigate();
  return (
    <div className="menu-page">
      <header className="header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
            <FaChevronLeft />
          </button>
          <h1 className="page-title">Offers</h1>
          <div />
        </div>
      </header>

      <div className="checkout-page" style={{ paddingTop: 25 }}>
        <div className="checkout-list">
          {offers.map(o => (
            <div key={o.id} className="checkout-card" style={{ background: '#fff', borderLeft: `6px solid var(--primary-color)`, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
              <div className="checkout-center" style={{ gridColumn: '1 / -1' }}>
                <div className="checkout-title-row">
                  <h4 className="checkout-item-name">{o.title}</h4>
                </div>
                <div className="checkout-item-sub">{o.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Offers;
