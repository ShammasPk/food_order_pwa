import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateMobile = (number) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(number);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!mobile) {
      setError('Please enter your mobile number');
      return;
    }

    if (!validateMobile(mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    // Create user object and save to localStorage
    const userData = {
      mobile: mobile,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem('foodApp_user', JSON.stringify(userData));
    setUser(userData);
    navigate('/home');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">🍽️ Food Delivery</h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
          Enter your mobile number to continue
        </p>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="mobile" className="form-label">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              className="form-input"
              placeholder="Enter 10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength="10"
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            Continue
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          No OTP verification required
        </div>
      </div>
    </div>
  );
};

export default Login;
