import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaUser, FaBuilding, FaThLarge, FaHashtag, FaPhone, FaStickyNote, FaCheckCircle } from 'react-icons/fa';
import flats from '../data/flats.json';

const DeliveryAddress = ({ cart, placeOrder, user }) => {
  const [selectedFlat, setSelectedFlat] = useState('');
  const [showFlats, setShowFlats] = useState(false);
  const [selectedSaved, setSelectedSaved] = useState('');
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
  const [savedAddresses, setSavedAddresses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setFlatsList(flats);
    const saved = JSON.parse(localStorage.getItem('foodApp_saved_addresses') || '[]');
    setSavedAddresses(saved);
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
    if (!selectedSaved && !selectedFlat) {
      alert('Please select a delivery address');
      return;
    }

    setIsPlacingOrder(true);

    const selected = flatsList.find(flat => flat.id === parseInt(selectedFlat));
    const selectedSavedEntry = savedAddresses.find(a => a.id === parseInt(selectedSaved));
    const deliveryAddress = overrideAddress ?? (
      selectedSavedEntry
        ? `${selectedSavedEntry.fullName} | ${selectedSavedEntry.flatName}, ${selectedSavedEntry.blockName}, Flat ${selectedSavedEntry.flatNumber} | ${selectedSavedEntry.contactNumber}${selectedSavedEntry.note ? ' | Note: ' + selectedSavedEntry.note : ''}`
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

        {/* Saved Addresses First */}
        <div className="address-options" style={{ marginBottom: '1rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Saved Addresses</h3>
          {savedAddresses.length === 0 && (
            <div className="address-option">
              <div className="address-details">
                <h4>No saved addresses yet</h4>
                <p>Use Add New Address to create one.</p>
              </div>
            </div>
          )}
          {savedAddresses.map(sa => (
            <div
              key={sa.id}
              className={`address-option ${selectedSaved === sa.id.toString() ? 'selected' : ''}`}
              onClick={() => { setSelectedSaved(sa.id.toString()); setSelectedFlat(''); }}
            >
              <input
                type="radio"
                name="saved"
                value={sa.id}
                checked={selectedSaved === sa.id.toString()}
                onChange={() => {}}
                className="address-radio"
              />
              <div className="address-details">
                <h4>{sa.flatName} — Flat {sa.flatNumber}</h4>
                <p>{sa.blockName} • {sa.fullName} • {sa.contactNumber}{sa.note ? ' • ' + sa.note : ''}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Address toggle */}
        <div className="address-options">
          <div 
            className={`address-option ${showFlats ? 'selected' : ''}`}
            onClick={() => setShowFlats(!showFlats)}
          >
            <div className="address-details">
              <h4>Add New Address</h4>
              <p>Select a flat to start and fill details</p>
            </div>
          </div>

          {showFlats && (
            <>
              <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Available Delivery Locations</h3>
              {flatsList.map(flat => (
                <div 
                  key={flat.id}
                  className={`address-option ${selectedFlat === flat.id.toString() ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedFlat(flat.id.toString());
                    setSelectedSaved('');
                    // Open details modal immediately to capture required info
                    setIsDetailsOpen(true);
                  }}
                >
                  <div className="address-details">
                    <h4>{flat.flatName}</h4>
                    <p>{flat.address}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="address-summary" style={{ marginTop: '1rem' }}>
          <div className="summary-row"><span>Items</span><span>{cart.length}</span></div>
          <div className="summary-row"><span>Quantity</span><span>{cart.reduce((t, i) => t + i.quantity, 0)}</span></div>
          <div className="summary-divider" />
          <div className="summary-row total"><span>Total Amount</span><span>₹{getTotalAmount()}</span></div>

          <div className="view-menu-btn-container">
            <button 
              className="view-menu-btn"
              onClick={() => {
                // If a saved address is selected, show confirmation directly
                if (selectedSaved) {
                  const sa = savedAddresses.find(a => a.id === parseInt(selectedSaved));
                  if (sa) {
                    const composed = `${sa.fullName} | ${sa.flatName}, ${sa.blockName}, Flat ${sa.flatNumber} | ${sa.contactNumber}${sa.note ? ' | Note: ' + sa.note : ''}`;
                    setPendingAddress(composed);
                    setIsConfirmOpen(true);
                    return;
                  }
                }
                // If a new flat is selected, open details modal to collect info
                if (selectedFlat) {
                  setIsDetailsOpen(true);
                  return;
                }
                alert('Please select a saved address or add a new one.');
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
