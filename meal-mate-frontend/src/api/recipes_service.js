const API_BASE_URL = 'http://localhost:5000'; // Backend API URL
import axios from 'axios';
import { getCurrentUser } from './authService';

// Get auth token from current user
const getAuthHeader = () => {
  const user = getCurrentUser();
  return user ? { 'Authorization': `Bearer ${user.token}` } : {};
};

export const getRecipes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
    throw error;
  }
};

export const getRecipeById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch recipe ${id}:`, error);
    throw error;
  }
};

export const getFavoriteRecipes = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/favorites`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch favorites for user ${userId}:`, error);
    throw error;
  }
};

export const toggleFavoriteRecipe = async (recipeId) => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not logged in');
    
    const response = await axios.post(`${API_BASE_URL}/api/users/${user.id}/favorites`, 
      { recipeId },
      { headers: getAuthHeader() }
    );
    return response.data.is_favorite;
  } catch (error) {
    console.error(`Failed to toggle favorite for recipe ${recipeId}:`, error);
    throw error;
  }
};

// Calendar Service Functions
export const getCalendar = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/calendar`, {
      headers: getAuthHeader(),
      params: { user_id: userId }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch calendar:', error);
    throw error;
  }
};

export const saveCalendar = async (userId, meals) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/calendar`, 
      { user_id: userId, meals },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to save calendar:', error);
    throw error;
  }
};
