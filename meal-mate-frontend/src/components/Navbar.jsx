import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ user, onLogout }) {
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <nav className="navbar">
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      {/* Rest of your Navbar content */}
    </nav>
  );
}
