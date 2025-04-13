import { useState, useEffect } from 'react';
import ModernRecipeCard from '../components/ModernRecipeCard';
import './FavoriteRecipes.css';
import { getFavoriteRecipes } from '../api/recipes_service';
import { getCurrentUser } from '../api/authService';

export default function FavoriteRecipes() {
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
    fetchFavorites();
  }, []);

  const handleSave = async (recipe) => {
    try {
      await fetchFavorites(); // Refresh the list after saving
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="favorites-container">Loading...</div>;
  if (error) return <div className="favorites-container">Error: {error}</div>;

  return (
    <div className="favorites-container">
      <h2 className="favorites-title">Your Favorite Recipes</h2>
      {saved.length === 0 ? (
        <div className="empty-state">
          <h3>No Favorite Recipes Yet</h3>
          <p>Browse recipes and click the star icon to add them to your favorites</p>
          <button 
            className="browse-recipes-btn"
            onClick={() => window.location.href = '/recipes'}
          >
            Browse Recipes
          </button>
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
