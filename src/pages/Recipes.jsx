import { useState } from 'react';
import './ModernRecipes.css';
import '../components/EmptyState.css';
import { recipes } from '../data/recipes';
import SearchBar from '../components/SearchBar';
import ModernRecipeCard from '../components/ModernRecipeCard';

export default function Recipes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [saved, setSaved] = useState([]);

  const handleSearch = (term) => setSearchTerm(term);
  const handleSave = (recipe) => {
    setSaved(prev =>
      prev.find(r => r.id === recipe.id)
        ? prev.filter(r => r.id !== recipe.id)
        : [...prev, recipe]
    );
  };

  const filtered = recipes.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ['Breakfast', 'Lunch', 'Dinner'];

  return (
    <div className="recipes-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Discover Culinary Delights</h1>
          <p>Explore our collection of delicious recipes from around the world</p>
        </div>
      </div>
      <div className="search-container">
        <SearchBar onSearch={handleSearch} />
      </div>
      {categories.map(cat => (
        <div key={cat} className="category-section">
          <h2 className="category-title">{cat}</h2>
          <div className="recipes-grid">
            {filtered.filter(r => r.category === cat).length > 0 ? (
              filtered
                .filter(r => r.category === cat)
                .map(recipe => (
                  <ModernRecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onSave={handleSave}
                    isSaved={saved.some(s => s.id === recipe.id)}
                  />
                ))
            ) : (
              <div className="empty-state">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" 
                  alt="No recipes found" 
                  className="empty-icon"
                />
                <p>No recipes found in this category</p>
                {searchTerm && <p>Try adjusting your search</p>}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
