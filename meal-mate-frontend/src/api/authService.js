// Base API configuration
const API_BASE_URL = 'http://localhost:5000';

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || "Registration failed");
    }

    if (!data.message) {
      throw new Error("Invalid response from server");
    }

    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username_or_email: credentials.username || credentials.email,
        password: credentials.password
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || "Login failed");
    }

    if (!data.user_id || !data.username) {
      throw new Error("Invalid response from server");
    }

    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify({
      id: data.user_id,
      username: data.username,
      email: data.email
    }));

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
