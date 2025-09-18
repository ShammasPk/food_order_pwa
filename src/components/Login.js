import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const Login = ({ setUser }) => {
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateMobile = (number) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(number);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

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
      name: name.trim(),
      mobile: mobile,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem('foodApp_user', JSON.stringify(userData));
    setUser(userData);
    navigate('/home');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="welcome-section">
          <div className="brand-logo">
            <img 
              src="/images/brand-logo.jpg" 
              alt="Brand Logo" 
              className="brand-logo-img"
            />
          </div>
          <h1>Welcome</h1>
          <p className="shop-address">123 Food Street, City Name, State - 123456</p>
        </div>
        
        <div className="login-card">
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <div className="input-icon">
                <FaUser />
              </div>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <div className="phone-input">
                <div className="country-code">
                  <span className="country-number">+91</span>
                </div>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength="10"
                />
              </div>
            </div>
            
            <div className="login-footer">
              <p className="delivery-info">
                For faster delivery, please call us at 
                <a href="tel:+911234567890" className="phone-link">+91 12345 67890</a>
              </p>
              <button type="submit" className="continue-btn">
                CONTINUE
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
