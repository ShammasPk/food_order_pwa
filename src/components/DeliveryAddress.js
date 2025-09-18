import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaUser, FaBuilding, FaThLarge, FaHashtag, FaPhone, FaStickyNote, FaCheckCircle } from 'react-icons/fa';
import flats from '../data/flats.json';

const DeliveryAddress = ({ cart, placeOrder, user }) => {
  const [selectedFlat, setSelectedFlat] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [flatsList, setFlatsList] = useState([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    flatName: '',
    blockName: '',
    flatNumber: '',
    contactNumber: '',
    note: ''
  });
  const [pendingAddress, setPendingAddress] = useState('');
  const [errors, setErrors] = useState({});
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setFlatsList(flats);
  }, []);

  // Initialize defaults when details modal opens
  useEffect(() => {
    if (isDetailsOpen) {
      const selected = flatsList.find(f => f.id === parseInt(selectedFlat));
      setForm(prev => ({
        ...prev,
        fullName: user?.name || prev.fullName || '',
        flatName: selected?.flatName || prev.flatName || '',
        contactNumber: user?.mobile || prev.contactNumber || ''
      }));
    }
  }, [isDetailsOpen, selectedFlat, flatsList, user]);

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const copy = { ...prev };
      if (value && copy[field]) delete copy[field];
      return copy;
    });
  };

  const getTotalAmount = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = 30;
    const gst = Math.round(subtotal * 0.05);
    return subtotal + deliveryFee + gst;
  };

  const handlePlaceOrder = async (overrideAddress) => {
    if (!useCustomAddress && !selectedFlat) {
      alert('Please select a delivery address');
      return;
    }

    if (useCustomAddress && !customAddress.trim()) {
      alert('Please enter your delivery address');
      return;
    }

    setIsPlacingOrder(true);

    const selected = flatsList.find(flat => flat.id === parseInt(selectedFlat));
    const deliveryAddress = overrideAddress ?? (
      useCustomAddress 
        ? customAddress.trim()
        : selected
          ? `${selected.flatName}, ${selected.address}`
          : ''
    );

    const orderData = {
      userMobile: user.mobile,
      deliveryAddress: deliveryAddress,
      orderTime: new Date().toLocaleString(),
    };

    try {
      // Simulate order placement delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newOrder = placeOrder(orderData);
      // Show styled success modal instead of alert
      setLastOrderId(newOrder.id);
      setIsSuccessOpen(true);
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="menu-page">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate('/checkout')} aria-label="Go back">
            <FaChevronLeft />
          </button>
          <h1 className="page-title">Delivery Address</h1>
          <div></div>
        </div>

      {/* Success Center Modal */}
      <div className={`center-modal-overlay ${isSuccessOpen ? 'open' : ''}`} onClick={() => setIsSuccessOpen(false)} />
      <div className={`center-modal ${isSuccessOpen ? 'open' : ''}`} role="dialog" aria-modal={isSuccessOpen}>
        <div className="success-card">
          <div className="success-icon-wrap">
            <FaCheckCircle className="success-icon" />
          </div>
          <h3 className="success-title">Your order is successfully placed.</h3>
          <p className="success-sub">Order ID: <strong>{lastOrderId}</strong>. You can track it in the "Orders" section.</p>
          <div className="view-menu-btn-container" style={{ marginTop: 8 }}>
            <button className="view-menu-btn" onClick={() => { setIsSuccessOpen(false); navigate('/home'); }}>Continue Shopping</button>
          </div>
          <button className="link-muted" onClick={() => { setIsSuccessOpen(false); navigate('/admin'); }}>Go to orders</button>
        </div>
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
                <h4>{flat.flatName}</h4>
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

        <div className="address-summary" style={{ marginTop: '1rem' }}>
          <div className="summary-row"><span>Items</span><span>{cart.length}</span></div>
          <div className="summary-row"><span>Quantity</span><span>{cart.reduce((t, i) => t + i.quantity, 0)}</span></div>
          <div className="summary-divider" />
          <div className="summary-row total"><span>Total Amount</span><span>₹{getTotalAmount()}</span></div>

          <div className="view-menu-btn-container">
            <button 
              className="view-menu-btn"
              onClick={() => {
                // Open details modal for additional address info
                if (!selectedFlat && !useCustomAddress) {
                  alert('Please select a delivery address');
                  return;
                }
                setIsDetailsOpen(true);
              }}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>

      {/* Details Bottom Sheet */}
      <div
        className={`bottom-sheet-overlay ${isDetailsOpen ? 'open' : ''}`}
        onClick={() => setIsDetailsOpen(false)}
      />
      <div className={`bottom-sheet ${isDetailsOpen ? 'open' : ''}`} role="dialog" aria-modal={isDetailsOpen}>
        <div className="bottom-sheet-header">
          <div className="bottom-sheet-title">Enter Delivery Details</div>
          <button className="bottom-sheet-close" onClick={() => setIsDetailsOpen(false)} aria-label="Close">×</button>
        </div>
        <div className="bottom-sheet-content">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', width:'100%' }}>
            <div style={{ gridColumn:'1 / -1' }}>
              <label style={{ fontSize:12, color:'#666' }}>Full Name</label>
              <div className="input-with-icon">
                <FaUser className="icon" />
                <input className={`form-input ${errors.fullName ? 'error' : ''}`} value={form.fullName} onChange={e=>setField('fullName', e.target.value)} placeholder="Enter full name" />
              </div>
              {errors.fullName && <div className="form-error">{errors.fullName}</div>}
            </div>
            <div style={{ gridColumn:'1 / -1' }}>
              <label style={{ fontSize:12, color:'#666' }}>Flat Name</label>
              <div className="input-with-icon">
                <FaBuilding className="icon" />
                <input className={`form-input ${errors.flatName ? 'error' : ''}`} value={form.flatName} onChange={e=>setField('flatName', e.target.value)} placeholder="E.g., Green Valley Apartments" />
              </div>
              {errors.flatName && <div className="form-error">{errors.flatName}</div>}
            </div>
            <div>
              <label style={{ fontSize:12, color:'#666' }}>Block Name/No.</label>
              <div className="input-with-icon">
                <FaThLarge className="icon" />
                <input className={`form-input ${errors.blockName ? 'error' : ''}`} value={form.blockName} onChange={e=>setField('blockName', e.target.value)} placeholder="Block / Tower" />
              </div>
              {errors.blockName && <div className="form-error">{errors.blockName}</div>}
            </div>
            <div>
              <label style={{ fontSize:12, color:'#666' }}>Flat Number</label>
              <div className="input-with-icon">
                <FaHashtag className="icon" />
                <input className={`form-input ${errors.flatNumber ? 'error' : ''}`} value={form.flatNumber} onChange={e=>setField('flatNumber', e.target.value)} placeholder="e.g., 1203" />
              </div>
              {errors.flatNumber && <div className="form-error">{errors.flatNumber}</div>}
            </div>
            <div style={{ gridColumn:'1 / -1' }}>
              <label style={{ fontSize:12, color:'#666' }}>Contact Number</label>
              <div className="input-with-icon">
                <FaPhone className="icon" />
                <input className={`form-input ${errors.contactNumber ? 'error' : ''}`} value={form.contactNumber} onChange={e=>setField('contactNumber', e.target.value)} placeholder="Phone number" />
              </div>
              {errors.contactNumber && <div className="form-error">{errors.contactNumber}</div>}
            </div>
            <div style={{ gridColumn:'1 / -1' }}>
              <label style={{ fontSize:12, color:'#666' }}>Note (optional)</label>
              <div className="input-with-icon textarea">
                <FaStickyNote className="icon" />
                <textarea className="form-input" rows="3" value={form.note} onChange={e=>setField('note', e.target.value)} placeholder="Add delivery instructions..." />
              </div>
            </div>
          </div>

          <div className="view-menu-btn-container" style={{ marginTop: 8 }}>
            <button
              className="view-menu-btn"
              onClick={() => {
                // Validate required fields with inline errors
                const newErrors = {};
                if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
                if (!form.flatName.trim()) newErrors.flatName = 'Flat name is required';
                if (!form.blockName.trim()) newErrors.blockName = 'Block name/number is required';
                if (!form.flatNumber.trim()) newErrors.flatNumber = 'Flat number is required';
                if (!form.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
                setErrors(newErrors);
                if (Object.keys(newErrors).length) return;
                // Save to localStorage (as JSON array)
                const saved = JSON.parse(localStorage.getItem('foodApp_saved_addresses') || '[]');
                const newEntry = {
                  id: Date.now(),
                  fullName: form.fullName.trim(),
                  flatName: form.flatName.trim(),
                  blockName: form.blockName.trim(),
                  flatNumber: form.flatNumber.trim(),
                  contactNumber: form.contactNumber.trim(),
                  note: form.note.trim(),
                };
                localStorage.setItem('foodApp_saved_addresses', JSON.stringify([newEntry, ...saved]));

                // Compose final address
                const composed = `${form.fullName.trim()} | ${form.flatName.trim()}, ${form.blockName.trim()}, Flat ${form.flatNumber.trim()} | ${form.contactNumber.trim()}${form.note.trim() ? ' | Note: ' + form.note.trim() : ''}`;
                setPendingAddress(composed);
                setIsDetailsOpen(false);
                setIsConfirmOpen(true);
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Bottom Sheet */}
      <div
        className={`bottom-sheet-overlay ${isConfirmOpen ? 'open' : ''}`}
        onClick={() => setIsConfirmOpen(false)}
      />
      <div className={`bottom-sheet ${isConfirmOpen ? 'open' : ''}`} role="dialog" aria-modal={isConfirmOpen}>
        <div className="bottom-sheet-header">
          <div className="bottom-sheet-title">Confirm Order</div>
          <button className="bottom-sheet-close" onClick={() => setIsConfirmOpen(false)} aria-label="Close">×</button>
        </div>
        <div className="bottom-sheet-content">
          <div style={{ background:'#fff', border:'1px solid #eee', borderRadius:8, padding:12 }}>
            <div style={{ fontWeight:800, marginBottom:6 }}>Delivery To</div>
            <div style={{ color:'#333', whiteSpace:'pre-wrap' }}>{pendingAddress || '(no address)'}</div>
          </div>
          <div className="summary-row" style={{ marginTop:10 }}><span>Total</span><span>₹{getTotalAmount()}</span></div>
          <div className="view-menu-btn-container">
            <button className="view-menu-btn" onClick={() => { setIsConfirmOpen(false); handlePlaceOrder(pendingAddress); }} disabled={isPlacingOrder}>
              {isPlacingOrder ? 'Placing Order...' : 'Confirm Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddress;
