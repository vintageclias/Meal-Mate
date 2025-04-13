import { useEffect, useState } from 'react';
import { getRecipes } from '../api/recipes_service';
import './Recipes.css';
import placeholderImage from '../assets/meal-mate-logo.png';
import SearchBar from '../components/SearchBar';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
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
    
    fetchRecipes();
  }, []);

  useEffect(() => {
    console.log('Search term changed:', searchTerm);
    const results = recipes.filter(recipe => {
      const matches = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
      console.log(`Recipe "${recipe.title}" matches:`, matches);
      return matches;
    });
    console.log('Filtered results:', results);
    setFilteredRecipes(results);
  }, [searchTerm, recipes]);

  const formatList = (text) => {
    if (!text) return '';
    return text.split('\n').map((item, i) => (
      <li key={i}>{item}</li>
    ));
  };

  return (
    <div className="recipes-container">
      <h1>Our Recipes</h1>
      
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading delicious recipes...</p>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="recipe-grid">
          {recipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <div className="recipe-image-container">
                <img 
                  src={recipe.image || placeholderImage} 
                  alt={recipe.title}
                  className="recipe-image"
                />
              </div>
              <div className="recipe-content">
                <h3 className="recipe-title">{recipe.title}</h3>
                
                {recipe.cookTime && (
                  <div className="recipe-meta">
                    <span>⏱️ {recipe.cookTime}</span>
                  </div>
                )}

                <div className="recipe-section">
                  <h4>Ingredients</h4>
                  <ul className="recipe-list">
                    {formatList(recipe.ingredients)}
                  </ul>
                </div>

                <div className="recipe-section">
                  <h4>Instructions</h4>
                  <ol className="recipe-list">
                    {formatList(recipe.instructions)}
                  </ol>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
