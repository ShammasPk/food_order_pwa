import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import flats from '../data/flats.json';

const DeliveryAddress = ({ cart, placeOrder, user }) => {
  const [selectedFlat, setSelectedFlat] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [flatsList, setFlatsList] = useState([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFlatsList(flats);
  }, []);

  const getTotalAmount = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = 30;
    const gst = Math.round(subtotal * 0.05);
    return subtotal + deliveryFee + gst;
  };

  const handlePlaceOrder = async () => {
    if (!useCustomAddress && !selectedFlat) {
      alert('Please select a delivery address');
      return;
    }

    if (useCustomAddress && !customAddress.trim()) {
      alert('Please enter your delivery address');
      return;
    }

    setIsPlacingOrder(true);

    const deliveryAddress = useCustomAddress 
      ? customAddress.trim()
      : flatsList.find(flat => flat.id === parseInt(selectedFlat))?.name + ', ' + 
        flatsList.find(flat => flat.id === parseInt(selectedFlat))?.address;

    const orderData = {
      userMobile: user.mobile,
      deliveryAddress: deliveryAddress,
      orderTime: new Date().toLocaleString(),
    };

    try {
      // Simulate order placement delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newOrder = placeOrder(orderData);
      
      // Show success message
      alert(`Order placed successfully! Order ID: ${newOrder.id}`);
      
      // Navigate back to home
      navigate('/home');
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <button 
            onClick={() => navigate('/checkout')}
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
          <div className="logo">Delivery Address</div>
          <div></div>
        </div>
      </header>

      <div className="address-container">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
          Select Delivery Address
        </h2>

        <div className="address-options">
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Available Delivery Locations</h3>
          
          {flatsList.map(flat => (
            <div 
              key={flat.id}
              className={`address-option ${selectedFlat === flat.id.toString() ? 'selected' : ''}`}
              onClick={() => {
                setSelectedFlat(flat.id.toString());
                setUseCustomAddress(false);
              }}
            >
              <input
                type="radio"
                name="address"
                value={flat.id}
                checked={selectedFlat === flat.id.toString()}
                onChange={() => {}}
                className="address-radio"
              />
              <div className="address-details">
                <h4>{flat.name}</h4>
                <p>{flat.address}</p>
              </div>
            </div>
          ))}

          <div 
            className={`address-option ${useCustomAddress ? 'selected' : ''}`}
            onClick={() => {
              setUseCustomAddress(true);
              setSelectedFlat('');
            }}
          >
            <input
              type="radio"
              name="address"
              value="custom"
              checked={useCustomAddress}
              onChange={() => {}}
              className="address-radio"
            />
            <div className="address-details">
              <h4>Other Address</h4>
              <p>Enter your custom delivery address</p>
            </div>
          </div>
        </div>

        {useCustomAddress && (
          <div className="custom-address">
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Enter Your Address</h3>
            <textarea
              className="form-input"
              placeholder="Enter your complete delivery address..."
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              rows="4"
              style={{ resize: 'vertical', minHeight: '100px' }}
            />
          </div>
        )}

        <div className="total-section" style={{ marginTop: '2rem' }}>
          <div className="total-amount">
            Total Amount: ₹{getTotalAmount()}
          </div>
          <div style={{ margin: '1rem 0', fontSize: '0.9rem', color: '#666' }}>
            Items: {cart.length} | Quantity: {cart.reduce((total, item) => total + item.quantity, 0)}
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            style={{ marginTop: '1rem' }}
          >
            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddress;
