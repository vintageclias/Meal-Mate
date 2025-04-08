import { useParams, useNavigate } from 'react-router-dom';
import { recipes } from '../data/recipes';

export default function RecipeDetails() {
  const { id } = useParams();
  const recipe = recipes.find(r => r.id === parseInt(id));

  if (!recipe) {
    return (
      <div className="recipe-details">
        <h1>Recipe Not Found</h1>
        <p>The requested recipe could not be found.</p>
      </div>
    );
  }

  const navigate = useNavigate();

  return (
    <div className="recipe-details">
      <button 
        onClick={() => navigate(-1)}
        className="back-button"
      >
        &larr; Back to Recipes
      </button>
      <h1>{recipe.title}</h1>
      <img src={recipe.image} alt={recipe.title} />
      <p><strong>Country:</strong> {recipe.country}</p>
      <h4>Ingredients</h4>
      <ul>{recipe.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
      <h4>Steps</h4>
      <ol>{recipe.steps.map((s, idx) => <li key={idx}>{s}</li>)}</ol>
    </div>
  );
}
