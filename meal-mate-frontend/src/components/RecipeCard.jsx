import { Link } from 'react-router-dom';
import placeholderImage from '../assets/meal-mate-logo.png';
import './RecipeCard.css';

export default function RecipeCard({ recipe, onSave, isSaved }) {
  const handleSaveClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (recipe.id && !isNaN(Number(recipe.id))) {
      onSave(recipe);
    }
  };

  return (
    <div className="recipe-card">
      <div className="recipe-image-container">
        <img 
          src={recipe.image || placeholderImage} 
          alt={recipe.title}
          className="recipe-image"
          onError={(e) => {
            e.target.src = placeholderImage;
          }}
        />
        <div className="recipe-badge">
          {recipe.cookingTime && <span>{recipe.cookingTime} min</span>}
          {recipe.difficulty && <span>{recipe.difficulty}</span>}
        </div>
      </div>
      
      <div className="recipe-content">
        <h3>{recipe.name || recipe.title}</h3>
        <div className="recipe-meta">
          {recipe.country && <span> {recipe.country}</span>}
          {recipe.totalTime && <span> {recipe.totalTime}</span>}
        </div>
        
        <div className="recipe-actions">
          <Link 
            to={`/recipes/${recipe.id}`}
            className="view-btn"
          >
            View Details
          </Link>
          <button 
            onClick={handleSaveClick}
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            disabled={!recipe.id || isNaN(Number(recipe.id))}
          >
            {isSaved ? "❤️ Saved" : "🤍 Save"}
            <span className="tooltip">{isSaved ? "Remove from favorites" : "Add to favorites"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
