import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from model import db, User, Recipe, Meal

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///meal_mate.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# CORS configuration
if os.environ.get('FLASK_ENV') == 'production':
    CORS(app, resources={
        r"/*": {
            "origins": ["https://*.onrender.com"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
else:
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173", "http://localhost:5176", "http://localhost:5177", "http://localhost:5178"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

# Initialize the database and migrations
migrate = Migrate(app, db)

# Define your routes here
# Example route
@app.route('/api/recipes', methods=['GET'])
def get_recipes():
    recipes = Recipe.query.all()
    return jsonify([recipe.to_dict() for recipe in recipes])

@app.route('/api/users/<int:user_id>/favorites', methods=['GET'])
def get_user_favorites(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    favorites = user.favorites.all()
    return jsonify([recipe.to_dict() for recipe in favorites])

if __name__ == '__main__':
    app.run(debug=True)
