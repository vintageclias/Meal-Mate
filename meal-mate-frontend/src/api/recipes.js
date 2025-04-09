import API_URL from './config';
import axios from 'axios';

export const getRecipes = async (token) => {
  try {
    const config = token ? {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    } : {};
    const response = await axios.get(`${API_URL}/api/recipes`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

export const getRecipeById = async (id, token) => {
  try {
    const config = token ? {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    } : {};
    const response = await axios.get(`${API_URL}/api/recipes/${id}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching recipe ${id}:`, error);
    throw error;
  }
};

export const getFavoriteRecipes = async (userId, token) => {
  try {
    const config = token ? {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    } : {};
    const response = await axios.get(`${API_URL}/api/users/${userId}/favorites`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};
 