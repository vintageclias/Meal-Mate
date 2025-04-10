import { useEffect, useState } from 'react';
import { getRecipes } from '../api/recipes_service';
import './Recipes.css';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, []);

  return (
    <div className="recipes-container">
      <h1>Our Recipes</h1>
      {loading ? (
        <div className="loading">Loading recipes...</div>
      ) : (
        <div className="recipe-grid">
          {recipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <h3>{recipe.title}</h3>
              <h4>Ingredients</h4>
              <p>{recipe.ingredients}</p>
              <h4>Instructions</h4>
              <p>{recipe.instructions}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
