import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Menu from './components/Menu';
import Checkout from './components/Checkout';
import DeliveryAddress from './components/DeliveryAddress';
import Admin from './components/Admin';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('foodApp_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem('foodApp_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Load orders from localStorage
    const savedOrders = localStorage.getItem('foodApp_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('foodApp_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    // Save orders to localStorage whenever they change
    localStorage.setItem('foodApp_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        return prevCart.filter(cartItem => cartItem.id !== itemId);
      }
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      ...orderData,
      items: cart,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    setOrders(prevOrders => [...prevOrders, newOrder]);
    clearCart();
    return newOrder;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/home" /> : <Login setUser={setUser} />} />
          <Route 
            path="/" 
            element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/home" 
            element={
              user ? (
                <Home 
                  user={user} 
                  cart={cart} 
                  addToCart={addToCart} 
                  removeFromCart={removeFromCart} 
                />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
          <Route 
            path="/menu" 
            element={
              user ? (
                <Menu 
                  user={user} 
                  cart={cart} 
                  addToCart={addToCart} 
                  removeFromCart={removeFromCart} 
                />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
          <Route 
            path="/checkout" 
            element={
              user ? (
                <Checkout 
                  cart={cart} 
                  removeFromCart={removeFromCart}
                  addToCart={addToCart}
                  user={user}
                />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route 
            path="/delivery-address" 
            element={
              user ? (
                <DeliveryAddress 
                  cart={cart}
                  placeOrder={placeOrder}
                  user={user}
                />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route 
            path="/admin" 
            element={<Admin orders={orders} setOrders={setOrders} />} 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
