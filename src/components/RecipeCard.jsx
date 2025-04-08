import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe, onSave, isSaved }) {
  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.title} />
      <h3>{recipe.title}</h3>
      <p>{recipe.country}</p>
      <Link to={`/recipes/${recipe.id}`}>View More</Link>
      <button onClick={() => onSave(recipe)}>
        {isSaved ? "❤️ Saved" : "🤍 Save"}
      </button>
    </div>
  );
}
