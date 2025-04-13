import { useState } from 'react';
import './Login.css';
import { register, login } from '../api/authService';
import { useNavigate } from 'react-router-dom';

export default function Signup({ onLogin }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const username = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const result = await register({ username, email, password });
      console.log('Registration response:', result);
      
      if (result && result.message === "User registered successfully") {
        
        const loginResult = await login({ email, password });
        if (loginResult && loginResult.message === "Login successful") {
          onLogin({
            name: username,
            email,
            id: loginResult.user_id
          });
          navigate('/', { state: { successMessage: "Account created successfully! You are now logged in." } });
        } else {
          setError("Account created but automatic login failed. Please login manually.");
        }
      } else {
        setError(result?.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error('Registration error:', error);
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
      <h1 className="login-title">Create Your Meal Mate Account</h1>
      {error && <div className="error-message">{error}</div>}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Enter your name"
            required
          />
        </div>
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
            placeholder="Create a password"
            required
          />
        </div>
        <button type="submit" className="login-btn">
          Sign Up
        </button>
      </form>
      <p className="signup-link">
        Already have an account? <a href="/login">Sign in</a>
      </p>
    </div>
  );
}
