import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import { getCurrentUser } from '../api/authService';

const API_BASE_URL = 'http://localhost:5000';

export default function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    joinDate: '',
    mealsPlanned: 0,
    dietaryPreferences: [],
    avatar: ''
  });

  useEffect(() => {
    const checkLoginAndFetchData = async () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        setIsLoading(true);
        try {
          const user = await getCurrentUser();
          if (user) {
            setProfile({
              name: user.username || '',
              joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
              mealsPlanned: user.mealCount || 0,
              dietaryPreferences: user.dietaryPreferences || [],
              avatar: user.avatar || ''
            });
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkLoginAndFetchData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!profile.name.trim()) {
      alert('Please enter a valid name');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/user/profile', { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          username: profile.name.trim(),
          dietaryPreferences: profile.dietaryPreferences
        })
      });
      
      const responseText = await response.text(); // Get the response as text
      console.log('Profile update response:', {
        status: response.status,
        text: responseText // Log the raw response text
      });
      
      let responseData;
      try {
        responseData = JSON.parse(responseText); // Try to parse as JSON
      } catch (e) {
        // If parsing fails, show the raw response
        throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        // Handle structured error responses from backend
        const errorMsg = responseData.error || 
                        responseData.message || 
                        'Failed to save profile';
        const details = responseData.details ? `\nDetails: ${responseData.details}` : '';
        throw new Error(`${errorMsg}${details}`);
      }

  
      setProfile(prev => ({
        ...prev,
        name: responseData.user?.username || prev.name,
        dietaryPreferences: prev.dietaryPreferences
      }));
      
      setIsEditing(false);
      alert(responseData.message || 'Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      alert(`Failed to update profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const togglePreference = (pref) => {
    setProfile(prev => {
      const newPrefs = prev.dietaryPreferences.includes(pref)
        ? prev.dietaryPreferences.filter(p => p !== pref)
        : [...prev.dietaryPreferences, pref];
      return { ...prev, dietaryPreferences: newPrefs };
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="profile-container">
        <div className="login-prompt">
          <h2>Please log in to view and edit your profile</h2>
          <div className="auth-links">
            <Link to="/login" className="auth-link">Login</Link>
            <span> or </span>
            <Link to="/signup" className="auth-link">Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="loading-message">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-letter">
          {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="profile-info">
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="profile-input"
              />
              <p>Member since: {profile.joinDate}</p>
              <p>Meals planned: {profile.mealsPlanned}</p>
              <button onClick={handleSave} className="save-button">
                Save Profile
              </button>
            </>
          ) : (
            <>
              <h1>{profile.name || 'User'}</h1>
              <p>Member since: {profile.joinDate}</p>
              <p>Meals planned: {profile.mealsPlanned}</p>
              <button onClick={handleEdit} className="edit-button">
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      <div className="profile-section">
        <h2 className="section-title">Dietary Preferences</h2>
        <div className="preferences-grid">
          {['Vegetarian', 'Nut-free', 'Lactose-free', 'Gluten-free'].map(pref => (
            <div 
              key={pref}
              className={`preference-item ${profile.dietaryPreferences.includes(pref) ? 'selected' : ''}`}
              onClick={() => isEditing && togglePreference(pref)}
            >
              <span>
                {pref === 'Vegetarian' && '🌱'}
                {pref === 'Nut-free' && '🥜'}
                {pref === 'Lactose-free' && '🥛'}
                {pref === 'Gluten-free' && '🌾'}
              </span>
              {pref}
            </div>
          ))}
        </div>
      </div>

      <div className="profile-section">
        <h2 className="section-title">Recent Meals</h2>
        <p>Your meal history will appear here</p>
      </div>
    </div>
  );
}
