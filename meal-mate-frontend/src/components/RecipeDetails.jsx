 import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getRecipeById } from '../api/recipes_service_v2';

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      console.log('Received recipe ID from URL:', id); // Added log
      let recipeId = null;
      if (id) {
        // Try parsing as number if it's a string
        recipeId = typeof id === 'string' ? parseInt(id, 10) : Number(id);
        
        // Check if we got a valid positive number
        if (isNaN(recipeId) || recipeId <= 0) {
          setError(`Invalid recipe ID: ${id}. Please select a valid recipe.`);
          setLoading(false);
          return;
        }
      }

      try {
        // Get token from localStorage (assuming you're using JWT)
        const token = localStorage.getItem('token');
        const response = await getRecipeById(recipeId, token);
        
        if (!response?.recipe) {
          throw new Error('Recipe not found');
        }

        // Ensure the recipe has required fields
        const completeRecipe = {
          ...response.recipe,
          name: response.recipe.name || 'Unnamed Recipe',
          ingredients: response.recipe.ingredients || [],
          instructions: response.recipe.instructions || []
        };

        setRecipe(completeRecipe);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError(err.message || 'Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <div className="recipe-details">Loading...</div>;
  if (error) return <div className="recipe-details">Error: {error}</div>;
  if (!recipe && !loading && !error) return (
    <div className="recipe-details">
      <h1>Recipe Not Found</h1>
      <p>The requested recipe could not be found.</p>
      <button 
        onClick={() => navigate(-1)}
        className="back-button"
      >
        &larr; Back to Recipes
      </button>
    </div>
  );

  const formatInstructions = (instructions) => {
    if (!instructions) return ['No preparation instructions provided'];
    if (Array.isArray(instructions)) return instructions;
    if (typeof instructions === 'string') return instructions.split('\n').filter(step => step.trim());
    return ['No preparation instructions provided'];
  };

  const formatIngredients = (ingredients) => {
    if (!ingredients) return ['No ingredients listed'];
    if (Array.isArray(ingredients)) return ingredients;
    if (typeof ingredients === 'string') return ingredients.split(',').map(i => i.trim());
    return ['No ingredients listed'];
  };

  if (!recipe) {
    return (
      <div className="recipe-details">
        <p>Loading recipe...</p>
      </div>
    );
  }

  return (
    <div className="recipe-details">
      <button 
        onClick={() => navigate(-1)}
        className="back-button"
      >
        &larr; Back to Recipes
      </button>
      
      <div className="recipe-header">
        <h1 className="recipe-title">{recipe.name || recipe.title || 'Unnamed Recipe'}</h1>
        <div className="recipe-image-container">
          <img 
            src={recipe.image || recipe.imageUrl || '/placeholder-food.jpg'} 
            alt={recipe.name || recipe.title || 'Recipe image'}
            className="recipe-main-image"
            onError={(e) => {
              e.target.src = '/placeholder-food.jpg';
            }}
          />
        </div>
      </div>

      <div className="recipe-meta-container">
        <div className="recipe-meta">
          {recipe.country && <div className="meta-item"><span className="meta-icon">🌍</span> {recipe.country}</div>}
          {recipe.cuisine && <div className="meta-item"><span className="meta-icon">🌎</span> {recipe.cuisine}</div>}
          {recipe.category && <div className="meta-item"><span className="meta-icon">🍽️</span> {recipe.category}</div>}
          {recipe.prepTime && <div className="meta-item"><span className="meta-icon">⏱️</span> Prep: {recipe.prepTime}</div>}
          {recipe.cookTime && <div className="meta-item"><span className="meta-icon">🔥</span> Cook: {recipe.cookTime}</div>}
          {recipe.totalTime && <div className="meta-item"><span className="meta-icon">⏳</span> Total: {recipe.totalTime}</div>}
          {recipe.servings && <div className="meta-item"><span className="meta-icon">👥</span> Serves: {recipe.servings}</div>}
          {recipe.difficulty && <div className="meta-item"><span className="meta-icon">📊</span> {recipe.difficulty}</div>}
          {recipe.calories && <div className="meta-item"><span className="meta-icon">🔥</span> {recipe.calories} kcal</div>}
        </div>
      </div>

      <div className="recipe-content">
        <div className="ingredients-section">
          <h2 className="section-title"> Ingredients</h2>
          <ul className="ingredients-list">
            {formatIngredients(recipe.ingredients).map((i, idx) => (
              <li key={idx} className="ingredient-item">
                <span className="ingredient-bullet">•</span>
                <span className="ingredient-text">{i}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="instructions-section">
          <h2 className="section-title"> Step-by-Step Instructions</h2>
          <div className="instructions-list">
            {formatInstructions(recipe.instructions).map((step, idx) => (
              <div key={idx} className="instruction-step">
                <div className="step-number">{idx + 1}</div>
                <div className="step-content">
                  <h3 className="step-heading">Step {idx + 1}</h3>
                  <p className="step-text">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {recipe.notes && (
          <div className="notes-section">
            <h2 className="section-title"> Chef's Notes</h2>
            <p className="notes-text">{recipe.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
