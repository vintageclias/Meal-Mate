import ModernRecipeCard from '../components/ModernRecipeCard';
import './FavoriteRecipes.css';

export default function FavoriteRecipes({ saved, onSave }) {
  return (
    <div className="favorites-container">
      <h2 className="favorites-title">Your Favorite Recipes</h2>
      {saved.length === 0 ? (
        <div className="empty-state">
          <p>You haven't saved any recipes yet!</p>
          <p>Start saving recipes to see them here.</p>
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
