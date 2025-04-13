import { useState, useEffect } from 'react';
import ModernRecipeCard from '../components/ModernRecipeCard';
import { Link } from 'react-router-dom';
import './FavoriteRecipes.css';
import { getFavoriteRecipes } from '../api/recipes_service';
import { getCurrentUser } from '../api/authService';

export default function FavoriteRecipes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      const data = await getFavoriteRecipes(user.id);
      setSaved(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    if (loggedIn) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, []);

  const handleSave = async (recipe) => {
    try {
      await fetchFavorites();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="favorites-container">Loading...</div>;
  if (error) return <div className="favorites-container">Error: {error}</div>;

  return (
    <div className="favorites-container">
      <h2 className="favorites-title">Your Favorite Recipes</h2>
      
      {!isLoggedIn ? (
        <div className="login-prompt">
          <div className="empty-state">
            <h3>Please sign in to view your favorite recipes</h3>
            <p>Your saved favorites will appear here once you're logged in</p>
            <div className="auth-links">
              <Link to="/login" className="auth-link">Login</Link>
              <span> or </span>
              <Link to="/signup" className="auth-link">Sign Up</Link>
            </div>
          </div>
        </div>
      ) : saved.length === 0 ? (
        <div className="empty-state">
          <h3>Your Favorite Recipes Collection is Empty</h3>
          <p>Discover delicious recipes and save your favorites to come back to later</p>
          <Link to="/recipes" className="browse-recipes-btn">
            Explore Recipes
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {saved.map(recipe => (
            <ModernRecipeCard
              key={recipe.id}
              recipe={recipe}
              onSave={handleSave}
              isSaved={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
