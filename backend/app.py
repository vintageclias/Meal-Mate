from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from model import db, User, Recipe, Meal 
from datetime import datetime
from flask_cors import CORS


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mealmate.db'  
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key'  
db.init_app(app)
migrate = Migrate(app, db)


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify(message="Username already exists"), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify(message="Email already exists"), 400
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=data['password']
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(message="User registered successfully"), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    # Allow login with either username or email
    user = User.query.filter(
        (User.username == data['username_or_email']) | 
        (User.email == data['username_or_email'])
    ).first()
    if user and user.password == data['password']:
        return jsonify(message="Login successful", user_id=user.id)
    return jsonify(message="Invalid credentials"), 401


@app.route('/recipes', methods=['GET'])
def get_recipes():
    recipes = Recipe.query.all()
    return jsonify([{'id': r.id, 'title': r.title, 'ingredients': r.ingredients} for r in recipes])

@app.route('/recipes', methods=['POST'])
def add_recipe():
    try:
        data = request.get_json()
        if not all(key in data for key in ['title', 'ingredients', 'user_id']):
            return jsonify({"error": "Missing required fields"}), 400
            
        new_recipe = Recipe(
            title=data['title'],
            ingredients=data['ingredients'],
            instructions=data.get('instructions', ''),
            user_id=data['user_id']
        )
        db.session.add(new_recipe)
        db.session.commit()
        return jsonify(message="Recipe added successfully"), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/recipes/<int:recipe_id>', methods=['GET'])
def get_recipe_by_id(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    return jsonify({'id': recipe.id, 'title': recipe.title, 'ingredients': recipe.ingredients, 'instructions': recipe.instructions})

@app.route('/recipes/<int:recipe_id>', methods=['PUT'])
def update_recipe(recipe_id):
    data = request.get_json()
    recipe = Recipe.query.get_or_404(recipe_id)
    recipe.title = data['title']
    recipe.ingredients = data['ingredients']
    recipe.instructions = data['instructions']
    db.session.commit()
    return jsonify(message="Recipe updated successfully")

@app.route('/recipes/<int:recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    db.session.delete(recipe)
    db.session.commit()
    return jsonify(message="Recipe deleted successfully")


@app.route('/meals', methods=['GET'])
def get_meals():
    meals = Meal.query.all()
    return jsonify([{'date': m.date, 'user_id': m.user_id, 'recipe_id': m.recipe_id, 'notes': m.notes} for m in meals])

@app.route('/meals', methods=['POST'])
def add_meal():
    try:
        data = request.get_json()
        if not all(key in data for key in ['date', 'user_id', 'recipe_id']):
            return jsonify({"error": "Missing required fields"}), 400
            
        new_meal = Meal(
            name=data.get('name', ''),
            date=datetime.strptime(data['date'], '%Y-%m-%d'),
            user_id=data['user_id'],
            recipe_id=data['recipe_id'],
            notes=data.get('notes', '')
        )
        db.session.add(new_meal)
        db.session.commit()
        return jsonify(message="Meal added successfully"), 201
    except ValueError as e:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/meals/<int:meal_id>', methods=['GET'])
def get_meal_by_id(meal_id):
    meal = Meal.query.get_or_404(meal_id)
    return jsonify({'date': meal.date, 'user_id': meal.user_id, 'recipe_id': meal.recipe_id, 'notes': meal.notes})

@app.route('/meals/<int:meal_id>', methods=['PUT'])
def update_meal(meal_id):
    data = request.get_json()
    meal = Meal.query.get_or_404(meal_id)
    meal.date = data['date']
    meal.user_id = data['user_id']
    meal.recipe_id = data['recipe_id']
    meal.notes = data['notes']
    db.session.commit()
    return jsonify(message="Meal updated successfully")

@app.route('/meals/<int:meal_id>', methods=['DELETE'])
def delete_meal(meal_id):
    meal = Meal.query.get_or_404(meal_id)
    db.session.delete(meal)
    db.session.commit()
    return jsonify(message="Meal deleted successfully")


if __name__ == '__main__':
    app.run(debug=True)
