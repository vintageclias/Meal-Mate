import API_URL from './config';
import axios from 'axios';


const mockRecipes = [
  {
    id: 1, 
    name: "Pasta Carbonara",
    ingredients: ["400g spaghetti", "200g pancetta", "4 eggs", "50g parmesan"],
    instructions: [
      "Bring large pot of salted water to boil and cook spaghetti according to package",
      "While pasta cooks, fry pancetta in a pan until crispy",
      "In a bowl, whisk eggs and grated parmesan together",
      "Drain pasta, reserving 1 cup of pasta water",
      "Quickly mix hot pasta with egg mixture, adding pasta water as needed to create creamy sauce",
      "Stir in pancetta and serve immediately"
    ],
    prepTime: "20 mins",
    cookTime: "15 mins",
    totalTime: "35 mins",
    servings: 4,
    difficulty: "Medium",
    category: "Italian",
    cuisine: "Italian",
    image: "/pasta-carbonara.jpg",
    tags: ["pasta", "dinner", "italian"],
    calories: 650,
    notes: "Use guanciale instead of pancetta for authentic Roman version"
  },
  {
    id: 2,
    name: "Vegetable Stir Fry", 
    ingredients: ["1 head broccoli, cut into florets", "2 carrots, julienned", "1 red bell pepper, sliced", "2 tbsp soy sauce", "1 tbsp sesame oil", "2 cloves garlic, minced"],
    instructions: [
      "Heat oil in wok or large pan over high heat",
      "Add garlic and stir for 30 seconds until fragrant",
      "Add carrots and stir fry for 2 minutes",
      "Add broccoli and bell pepper, stir fry for 3 more minutes",
      "Add soy sauce and toss to combine",
      "Serve immediately over rice"
    ],
    prepTime: "15 mins",
    cookTime: "10 mins",
    totalTime: "25 mins",
    servings: 2,
    difficulty: "Easy",
    category: "Asian",
    cuisine: "Chinese",
    image: "/stir-fry.jpg",
    tags: ["vegetarian", "quick", "healthy"],
    calories: 320
  },
  {
    id: 3,
    name: "Chicken Tikka Masala",
    ingredients: [
      "500g chicken breast, cubed",
      "1 cup yogurt",
      "2 tbsp tikka masala paste",
      "1 onion, diced",
      "2 cloves garlic",
      "1 can crushed tomatoes",
      "1/2 cup cream",
      "1 tsp garam masala"
    ],
    instructions: [
      "Marinate chicken in yogurt and 1 tbsp tikka paste for 1 hour",
      "Grill or bake chicken until cooked through",
      "In a pan, sauté onion and garlic until soft",
      "Add remaining tikka paste and cook for 1 minute",
      "Add tomatoes and simmer for 10 minutes",
      "Stir in cream and garam masala",
      "Add cooked chicken and simmer for 5 more minutes"
    ],
    prepTime: "20 mins",
    cookTime: "30 mins",
    totalTime: "50 mins",
    servings: 4,
    difficulty: "Medium",
    category: "Indian",
    cuisine: "Indian",
    image: "/tikka-masala.jpg",
    tags: ["chicken", "dinner", "spicy"],
    calories: 450,
    notes: "Serve with basmati rice and naan bread"
  },
  {
    id: 4,
    name: "Avocado Toast",
    ingredients: [
      "2 slices sourdough bread",
      "1 ripe avocado",
      "1 tbsp lemon juice",
      "Salt and pepper to taste",
      "Red pepper flakes (optional)",
      "2 eggs (optional)"
    ],
    instructions: [
      "Toast bread until golden and crisp",
      "Mash avocado with lemon juice, salt and pepper",
      "Spread avocado mixture on toast",
      "Top with red pepper flakes if desired",
      "For extra protein, add a poached or fried egg on top"
    ],
    prepTime: "5 mins",
    cookTime: "5 mins",
    totalTime: "10 mins",
    servings: 1,
    difficulty: "Easy",
    category: "Breakfast",
    cuisine: "International",
    image: "/avocado-toast.jpg",
    tags: ["vegetarian", "quick", "breakfast"],
    calories: 350
  }
];

const isDev = process.env.NODE_ENV === 'development';

export async function getRecipes(token) {
  if (isDev && !token) {
    console.warn('Development mode: Using mock recipes data');
    return { recipes: mockRecipes };
  }

  try {
    const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
    const res = await axios.get(`${API_URL}/api/recipes`, config);
    return res.data;
  } catch (error) {
    console.error('API Error:', error);
    if (isDev) {
      console.warn('Development fallback: Using mock data');
      return { recipes: mockRecipes };
    }
    throw error;
  }
}

export async function getRecipeById(id, token) {
  console.log('Fetching recipe with ID:', id); // Added log
  try {
    const config = {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    };
    
    if (isDev && !token) {
      console.warn('Development mode: Using mock recipe data');
      const recipeId = Number(id);
      const foundRecipe = mockRecipes.find(r => r.id === recipeId);
      return { recipe: foundRecipe || null };
    }

    // Validate ID format before making the request
    const recipeId = Number(id);
    if (isNaN(recipeId) || recipeId <= 0) {
      throw new Error(`Invalid recipe ID format: ${id}. Must be a positive number.`);
    }

    const res = await axios.get(`${API_URL}/api/recipes/${recipeId}`, config);
    
    if (!res.data?.recipe) {
      throw new Error(`Recipe with ID ${recipeId} not found`);
    }
    
    return res.data;
  } catch (error) {
    console.error(`Error fetching recipe ${id}:`, error);
    if (isDev) {
      return { recipe: mockRecipes.find(r => r.id === Number(id)) || null };
    }
    throw error;
  }
}

export async function getFavoriteRecipes(userId, token) {
  if (isDev && !token) {
    console.warn('Development mode: Using mock favorites data');
    return { recipes: mockRecipes };
  }

  try {
    const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
    const res = await axios.get(`${API_URL}/api/users/${userId}/favorites`, config);
    return res.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    if (isDev) {
      return { recipes: mockRecipes };
    }
    throw error;
  }
}
