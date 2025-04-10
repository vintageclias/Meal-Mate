import { useState, useEffect } from 'react';
import ModernRecipeCard from '../components/ModernRecipeCard';
import './FavoriteRecipes.css';
import { getFavoriteRecipes } from '../api/recipes_service_v2';

export default function FavoriteRecipes() {
  const [saved, setSaved] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // TODO: Replace with actual user ID when auth is implemented
        const data = await getFavoriteRecipes('current-user');
        setSaved(Array.isArray(data) ? data : []); // Ensure data is always an array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleSave = (recipe) => {
    setSaved(prev =>
      prev.find(r => r.id === recipe.id)
        ? prev.filter(r => r.id !== recipe.id)
        : [...prev, recipe]
    );
  };
  if (loading) return <div className="favorites-container">Loading...</div>;
  if (error) return <div className="favorites-container">Error: {error}</div>;

  return (
    <div className="favorites-container">
      <h2 className="favorites-title">Your Favorite Recipes</h2>
      {!saved || saved.length === 0 ? (
        <div className="empty-state">
          <h3>Select Your Favorite Recipes</h3>
          <p>Browse recipes and click the heart icon to add them to your favorites</p>
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
              onSave={onSave}
              isSaved={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
