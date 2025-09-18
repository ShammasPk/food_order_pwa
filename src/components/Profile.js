import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaUser, FaPhone, FaHome, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', mobile: '' });
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    setForm({ name: user?.name || '', mobile: user?.mobile || '' });
    const saved = JSON.parse(localStorage.getItem('foodApp_saved_addresses') || '[]');
    setAddresses(saved);
  }, [user]);

  const saveProfile = () => {
    const updated = { ...(user || {}), name: form.name, mobile: form.mobile };
    setUser(updated);
    localStorage.setItem('foodApp_user', JSON.stringify(updated));
    alert('Profile updated');
  };

  const deleteAddress = (id) => {
    const filtered = addresses.filter(a => a.id !== id);
    setAddresses(filtered);
    localStorage.setItem('foodApp_saved_addresses', JSON.stringify(filtered));
  };

  return (
    <div className="menu-page">
      <header className="header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back"><FaChevronLeft /></button>
          <h1 className="page-title">Profile</h1>
          <div />
        </div>
      </header>

      <div className="checkout-page" style={{ paddingTop: 25 }}>
        <div className="checkout-summary" style={{ marginBottom: 16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
            <div style={{ gridColumn:'1 / -1' }}>
              <label style={{ fontSize:12, color:'#666' }}>Full Name</label>
              <div className="input-with-icon">
                <FaUser className="icon" />
                <input className="form-input" value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })} placeholder="Your name" />
              </div>
            </div>
            <div style={{ gridColumn:'1 / -1' }}>
              <label style={{ fontSize:12, color:'#666' }}>Mobile Number</label>
              <div className="input-with-icon">
                <FaPhone className="icon" />
                <input className="form-input" value={form.mobile} onChange={e=>setForm({ ...form, mobile: e.target.value })} placeholder="Your mobile" />
              </div>
            </div>
          </div>
          <div className="view-menu-btn-container" style={{ marginTop: 10 }}>
            <button className="view-menu-btn" onClick={saveProfile}>Save Profile</button>
          </div>
        </div>

        <h3 style={{ margin: '10px 0' }}>Saved Addresses</h3>
        {addresses.length === 0 && (
          <div className="empty-cart">
            <div className="empty-icon"><FaHome /></div>
            <p className="empty-sub">No saved addresses yet.</p>
          </div>
        )}

        {addresses.length > 0 && (
          <div className="checkout-list">
            {addresses.map(a => (
              <div key={a.id} className="checkout-card">
                <div className="checkout-center" style={{ gridColumn:'1 / -1' }}>
                  <div className="checkout-title-row">
                    <div className="checkout-item-name">{a.flatName} — Flat {a.flatNumber}</div>
                    <button className="checkout-remove" onClick={() => deleteAddress(a.id)} aria-label="Delete saved address">
                      <FaTrash size={14} />
                    </button>
                  </div>
                  <div className="checkout-item-sub">{a.blockName}</div>
                  <div className="checkout-item-sub">{a.fullName} • {a.contactNumber}</div>
                  {a.note && <div className="checkout-item-sub">Note: {a.note}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
