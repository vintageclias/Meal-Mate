import { useEffect, useState, useMemo } from 'react';
import { getRecipes, toggleFavoriteRecipe } from '../api/recipes_service';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import './Recipes.css';
import placeholderImage from '../assets/meal-mate-logo.png';
import SearchBar from '../components/SearchBar';

export default function Recipes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);

  const handleFavorite = async (recipe) => {
    try {
      await toggleFavoriteRecipe(recipe.id);
      setFavorites(prev => 
        prev.includes(recipe.id) 
          ? prev.filter(id => id !== recipe.id)
          : [...prev, recipe.id]
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  
  const placeholderRecipes = Array(15).fill().map((_, i) => ({
    id: i + 1, 
    title: `Recipe ${i+1}`,
    ingredients: 'Sample ingredients',
    image: placeholderImage
  }));

  useEffect(() => {
    
    setRecipes(placeholderRecipes);
    
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      setLoading(true);
      getRecipes()
        .then(data => {
          setRecipes(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to fetch recipes:', error);
          setLoading(false);
          
        });
    } else {
      setLoading(false);
    }
  }, []);

  const filteredRecipes = useMemo(() => 
    recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase())
    ), [recipes, searchTerm]
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
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onSave={handleFavorite}
                isSaved={favorites.includes(recipe.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
