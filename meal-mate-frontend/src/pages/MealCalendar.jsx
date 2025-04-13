import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MealCalendar.css';
import { getCurrentUser } from '../api/authService';
import { getCalendar, saveCalendar } from '../api/recipes_service';
import DaySelectionModal from '../components/DaySelectionModal';
import MealItem from '../components/MealItem';
import MealDropTarget from '../components/MealDropTarget';
import MealModal from './MealModal';

export default function MealCalendar({ mealData }) {
  const currentUser = getCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [assignedMeals, setAssignedMeals] = useState(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load saved calendar on mount
  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      getCalendar(currentUser.id)
        .then(data => {
          setAssignedMeals(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Failed to load calendar:', err);
          setError('Failed to load calendar data');
          setIsLoading(false);
        });
    }
  }, [currentUser]);
  const [expandedDay, setExpandedDay] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [mealToAdd, setMealToAdd] = useState(null);

  const filteredMeals = Object.keys(mealData || {}).filter(meal =>
    meal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDrop = async (day, meal) => {
    const updatedMeals = {
      ...assignedMeals,
      [day]: [...(assignedMeals[day] || []), meal]
    };
    setAssignedMeals(updatedMeals);
    
    if (currentUser) {
      try {
        await saveCalendar(currentUser.id, updatedMeals);
      } catch (err) {
        console.error('Failed to save calendar:', err);
        setError('Failed to save calendar changes');
      }
    }
  };

  const clearCalendar = async () => {
    const emptyCalendar = daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {});
    setAssignedMeals(emptyCalendar);
    
    if (currentUser) {
      try {
        await saveCalendar(currentUser.id, emptyCalendar);
      } catch (err) {
        console.error('Failed to clear calendar:', err);
        setError('Failed to clear calendar');
      }
    }
  };

  const toggleDay = (day) => {
    setExpandedDay(prev => prev === day ? null : day);
  };

  return (
    <div className="calendar-container">
      <div className="meal-selection">
        <h2>Meal Library</h2>
        {currentUser ? (
          <div>
            <h3 className="welcome-message">Welcome, {currentUser.username}!</h3>
            <p className="search-instruction">Search for meals below to plan your week</p>
          </div>
        ) : (
          <div className="login-prompt" style={{textAlign: 'center', padding: '20px'}}>
            <h3 style={{color: '#4CAF50', fontSize: '2em', marginBottom: '15px'}}>Welcome to MealMate!</h3>
            <p style={{fontSize: '1.2em', marginBottom: '20px'}}>Please log in to plan your meals for the week</p>
            <img 
              src="/placeholder-food.jpg" 
              alt="Welcome Illustration" 
              style={{ 
                width: '100%', 
                maxWidth: '400px', 
                marginBottom: '20px',
                borderRadius: '8px'
              }} 
            />
            <div className="auth-links">
              <Link to="/login" className="auth-link">Login</Link>
              <span> or </span>
              <Link to="/signup" className="auth-link">Sign Up</Link>
            </div>
          </div>
        )}

        {currentUser && (
          <>
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
                    src={`${mealData[meal]?.image}?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150`}
                    alt={meal}
                    className="meal-thumbnail"
                    onClick={() => setSelectedMeal({name: meal, ...mealData[meal]})}
                  />
                  <div className="meal-info">
                    <h4>{meal}</h4>
                    <p>{mealData[meal]?.calories} kcal</p>
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
          </>
        )}
      </div>

      {selectedMeal && (
        <MealModal meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
      )}

      {isLoading && <div className="loading-message">Loading your meal plan...</div>}
      {error && <div className="error-message">{error}</div>}
      {currentUser && !isLoading && (
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
                        <MealItem key={i} name={meal} onDrop={handleDrop} />
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
