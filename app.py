from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from model import db, User, Recipe, Meal 
from datetime import datetime

# Initialization of  the Flask app, SQLAlchemy, Migrate, and JWT
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mealmate.db'  
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this for production
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Routes for user authentication
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify(message="User already exists"), 400
    new_user = User(username=data['username'], password=data['password'])  # Password should be hashed in production
    db.session.add(new_user)
    db.session.commit()
    return jsonify(message="User registered successfully"), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username'], password=data['password']).first()  # Password comparison should be hashed in production
    if user:
        token = create_access_token(identity=user.id)
        return jsonify(access_token=token)
    return jsonify(message="Invalid credentials"), 401

# CRUD operations for Recipes
@app.route('/recipes', methods=['GET'])
@jwt_required()
def get_recipes():
    recipes = Recipe.query.all()
    return jsonify([{'id': r.id, 'title': r.title, 'ingredients': r.ingredients} for r in recipes])

@app.route('/recipes', methods=['POST'])
@jwt_required()
def add_recipe():
    data = request.get_json()
    new_recipe = Recipe(title=data['title'], ingredients=data['ingredients'], instructions=data['instructions'], user_id=data['user_id'])
    db.session.add(new_recipe)
    db.session.commit()
    return jsonify(message="Recipe added successfully"), 201

@app.route('/recipes/<int:recipe_id>', methods=['GET'])
@jwt_required()
def get_recipe_by_id(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    return jsonify({'id': recipe.id, 'title': recipe.title, 'ingredients': recipe.ingredients, 'instructions': recipe.instructions})

@app.route('/recipes/<int:recipe_id>', methods=['PUT'])
@jwt_required()
def update_recipe(recipe_id):
    data = request.get_json()
    recipe = Recipe.query.get_or_404(recipe_id)
    recipe.title = data['title']
    recipe.ingredients = data['ingredients']
    recipe.instructions = data['instructions']
    db.session.commit()
    return jsonify(message="Recipe updated successfully")

@app.route('/recipes/<int:recipe_id>', methods=['DELETE'])
@jwt_required()
def delete_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    db.session.delete(recipe)
    db.session.commit()
    return jsonify(message="Recipe deleted successfully")

# CRUD operations for Meals
@app.route('/meals', methods=['GET'])
@jwt_required()
def get_meals():
    meals = Meal.query.all()
    return jsonify([{'date': m.date, 'user_id': m.user_id, 'recipe_id': m.recipe_id, 'notes': m.notes} for m in meals])

@app.route('/meals', methods=['POST'])
@jwt_required()
def add_meal():
    data = request.get_json()
    new_meal = Meal(date=data['date'], user_id=data['user_id'], recipe_id=data['recipe_id'], notes=data['notes'])
    db.session.add(new_meal)
    db.session.commit()
    return jsonify(message="Meal added successfully"), 201

@app.route('/meals/<int:meal_id>', methods=['GET'])
@jwt_required()
def get_meal_by_id(meal_id):
    meal = Meal.query.get_or_404(meal_id)
    return jsonify({'date': meal.date, 'user_id': meal.user_id, 'recipe_id': meal.recipe_id, 'notes': meal.notes})

@app.route('/meals/<int:meal_id>', methods=['PUT'])
@jwt_required()
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
@jwt_required()
def delete_meal(meal_id):
    meal = Meal.query.get_or_404(meal_id)
    db.session.delete(meal)
    db.session.commit()
    return jsonify(message="Meal deleted successfully")

# Main entry point
if __name__ == '__main__':
    app.run(debug=True)
