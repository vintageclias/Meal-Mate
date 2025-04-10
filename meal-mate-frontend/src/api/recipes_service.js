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
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/favorites`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch favorites for user ${userId}:`, error);
    throw error;
  }
};
