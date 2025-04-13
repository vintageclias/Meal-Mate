# Meal Mate - Meal Planning Application

## Project Description
A full-stack meal planning application with:
- Flask backend API
- React frontend
- SQLite database
- User authentication
- Recipe management
- Meal scheduling

## Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/meal-mate.git
cd meal-mate
```

### 2. Backend Setup (Flask)
```bash
cd backend
pipenv install  
pipenv shell   
flask db upgrade
flask run
```
Runs at http://127.0.0.1:5000

### 3. Frontend Setup (React)
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
Runs at http://localhost:5173

## API Endpoints

### Authentication
- POST `/register` - Register new user
- POST `/login` - User login

### Recipes
- GET `/recipes` - List all recipes
- POST `/recipes` - Add new recipe
- GET/PUT/DELETE `/recipes/<id>` - Manage specific recipe

### Meals
- GET `/meals` - List all meals
- POST `/meals` - Add new meal (requires date, user_id, recipe_id)
- GET/PUT/DELETE `/meals/<id>` - Manage specific meal

## Database Schema
- Users: id, username, email, password
- Recipes: id, title, ingredients, instructions, user_id
- Meals: id, name, date, user_id, recipe_id, notes

## Testing
Use Postman to test API endpoints. Sample JSON:
```json
{
    "date": "2023-11-20",
    "user_id": 1,
    "recipe_id": 1,
    "name": "Dinner",
    "notes": "Family meal"
}
```

