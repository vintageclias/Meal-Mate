import React, { useState, useEffect } from 'react';
import './Login.css';
import { login, logout } from '../api/authService';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      const user = JSON.parse(localStorage.getItem('user'));
      setUsername(user?.username || '');
    }
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUsername('');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const result = await login({ email, password });
      if (result && result.message === "Login successful") {
        onLogin({
          name: result.username || email.split('@')[0],
          email,
          id: result.user_id
        });
        navigate('/', { state: { successMessage: "You have successfully logged in!" } });
      } else {
        setError(result?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img 
        src="https://r2.erweima.ai/i/4a1oV2N3Rc2sXFPAguCfFw.png" 
        alt="Meal Mate" 
        className="login-logo" 
      />
      {isLoggedIn ? (
        <div className="logged-in-view">
          <h1 className="login-title">Welcome back, {username}!</h1>
          <p className="welcome-message">You are already logged in.</p>
          <div className="logged-in-actions">
            <button 
              onClick={() => navigate('/profile')}
              className="profile-btn"
            >
              View Profile
            </button>
            <button 
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="login-title">Welcome Back To Meal Mate</h1>
          {error && <div className="error-message">{error}</div>}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="login-btn">
              Sign In
            </button>
          </form>
          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </>
      )}
    </div>
  );
}
