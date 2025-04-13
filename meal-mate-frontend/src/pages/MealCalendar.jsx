import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MealCalendar.css';
import { getCurrentUser } from '../api/authService';
import DaySelectionModal from '../components/DaySelectionModal';
import MealItem from '../components/MealItem';
import MealDropTarget from '../components/MealDropTarget';
import MealModal from './MealModal';

const randomMeals = [
  {
    name: 'Pasta Carbonara',
    calories: 650,
    image: 'https://stefaniaskitchenette.com/wp-content/uploads/2024/07/Carbonara-5.webp'
  },
  {
    name: 'Vegetable Stir Fry',
    calories: 420,
    image: 'https://recipe30.com/wp-content/uploads/2021/08/Asian-stirfried-vegetables.jpg'
  },
  {
    name: 'Chicken Salad',
    calories: 320,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjccKaUyspWO-DaBm4G_aWjLAxx1mvBq4qwQ&s'
  },
  {
    name: 'Beef Burger',
    calories: 780,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Fruit Smoothie',
    calories: 250,
    image: 'https://veggiefunkitchen.com/wp-content/uploads/2022/08/Dragon-Fruit-Smoothie-5-scaled.jpg'
  },
  {
    name: 'Pancakes',
    calories: 380,
    image: 'https://eggs.ca/wp-content/uploads/2024/06/fluffy-pancakes-1664x832-1.jpg'
  },
  {
    name: 'Grilled Salmon',
    calories: 450,
    image: 'https://www.cookingclassy.com/wp-content/uploads/2018/05/grilled-salmon-3.jpg'
  },
  {
    name: 'Vegetable Soup',
    calories: 200,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT3kJock5STxuGyeOAdKVnZY6Yuh2KCiAS6Q&s'
  }
];

export default function MealCalendar() {
  const currentUser = getCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [assignedMeals, setAssignedMeals] = useState(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  );
  const [expandedDay, setExpandedDay] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [mealToAdd, setMealToAdd] = useState(null);

  const filteredMeals = randomMeals.filter(meal =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDrop = (day, meal) => {
    const mealToAdd = typeof meal === 'object' ? meal : randomMeals.find(m => m.name === meal);
    const updatedMeals = {
      ...assignedMeals,
      [day]: [...(assignedMeals[day] || []), mealToAdd]
    };
    setAssignedMeals(updatedMeals);
  };

  const clearCalendar = () => {
    const emptyCalendar = daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {});
    setAssignedMeals(emptyCalendar);
  };

  const toggleDay = (day) => {
    setExpandedDay(prev => prev === day ? null : day);
  };

  return (
    <div className="calendar-container">
      <div className="meal-selection">
        <h2>Meal Planner</h2>
        {!currentUser ? (
          <div className="login-prompt">
            <h3>Welcome to Meal Planner</h3>
            <p>Login to create your personalized meal plan for the week</p>
            <p>Plan your meals, track nutrition, and save your favorite recipes</p>
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80" 
              alt="Food illustration"
              className="welcome-image"
            />
            <div className="auth-links">
              <Link to="/login" className="auth-link">Login</Link>
              <span> or </span>
              <Link to="/signup" className="auth-link">Sign Up</Link>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h3>Welcome back, {currentUser.username}!</h3>
              <p>Drag meals to your calendar</p>

              <div className="search-container">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search meals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="meal-search"
                />
              </div>

              <div className="meal-grid">
                {filteredMeals.map((meal, i) => (
                  <div className="meal-card" key={i}>
                    <img 
                      src={meal.image}
                      alt={meal.name}
                      className="meal-thumbnail"
                      onClick={() => setSelectedMeal(meal)}
                    />
                    <div className="meal-info">
                      <h4>{meal.name}</h4>
                      <p>{meal.calories} kcal</p>
                      <button 
                        className="add-to-calendar-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMealToAdd(meal);
                          setShowDayModal(true);
                        }}
                      >
                        Add to Calendar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {selectedMeal && (
        <MealModal meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
      )}

      {currentUser && (
        <>
          <div className="calendar-grid">
            {daysOfWeek.map(day => (
              <div className="day-card" key={day}>
                <div className="day-header">
                  <h3>{day}</h3>
                  <button 
                    onClick={() => toggleDay(day)}
                    className="day-toggle"
                  >
                    {expandedDay === day ? '−' : '+'}
                  </button>
                </div>
                
                {expandedDay === day && (
                  <div className="day-meals">
                    {assignedMeals[day].length > 0 ? (
                      assignedMeals[day].map((meal, i) => (
                        <div className="calendar-meal-card" key={i}>
                          <img 
                            src={meal.image} 
                            alt={meal.name}
                            className="calendar-meal-image"
                          />
                          <div className="calendar-meal-info">
                            <h4>{meal.name}</h4>
                            <p>{meal.calories} kcal</p>
                          </div>
                          <button 
                            className="remove-meal-btn"
                            onClick={() => handleDrop(day, meal)}
                          >
                            ×
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <p>No meals planned</p>
                        <MealDropTarget day={day} onDrop={handleDrop} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="calendar-controls">
            <button onClick={clearCalendar} className="clear-btn">
              Reset Week
            </button>
          </div>
        </>
      )}

      {showDayModal && (
        <DaySelectionModal
          meal={mealToAdd}
          onSelectDay={(day) => {
            handleDrop(day, mealToAdd);
            setShowDayModal(false);
          }}
          onClose={() => setShowDayModal(false)}
        />
      )}
    </div>
  );
}