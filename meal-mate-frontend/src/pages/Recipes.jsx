import { useEffect, useState } from 'react';
import { getRecipes, toggleFavoriteRecipe } from '../api/recipes_service';
import { Link } from 'react-router-dom';
import './Recipes.css';
import placeholderImage from '../assets/meal-mate-logo.png';
import SearchBar from '../components/SearchBar';

export default function Recipes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);

  const handleFavorite = async (recipeId) => {
    try {
      await toggleFavoriteRecipe(recipeId);
      setFavorites(prev => 
        prev.includes(recipeId) 
          ? prev.filter(id => id !== recipeId)
          : [...prev, recipeId]
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
        setFilteredRecipes(data); // Initialize filtered recipes
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('Failed to load recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (loggedIn) {
      fetchRecipes();
    } else {
      setLoading(false);
    }
  }, []);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="recipes-container">
      <h1>Our Recipes</h1>
      {!isLoggedIn ? (
        <div className="login-prompt">
          <h2>Please login or signup to view and search recipes</h2>
          <div className="auth-links">
            <Link to="/login" className="auth-link">Login</Link>
            <span> or </span>
            <Link to="/signup" className="auth-link">Sign Up</Link>
          </div>
        </div>
      ) : loading ? (
        <div className="loading">Loading recipes...</div>
      ) : (
        <>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="recipe-grid">
            {filteredRecipes.map(recipe => (
              <div key={recipe.id} className="recipe-card">
                <h3>{recipe.title}</h3>
                <h4>Ingredients</h4>
                <p>{recipe.ingredients}</p>
                <h4>Instructions</h4>
                <p>{recipe.instructions}</p>
                <button 
                  className={`favorite-btn ${favorites.includes(recipe.id) ? 'favorited' : ''}`}
                  onClick={() => handleFavorite(recipe.id)}
                >
                  {favorites.includes(recipe.id) ? '★' : '☆'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
