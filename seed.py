from app import app, db
from model import User, Recipe, Meal
from faker import Faker
import random
from datetime import datetime


fake = Faker()


def generate_users(n=10):
    """Generate n unique fake users"""
    users = []
    for _ in range(n):
        while True:  
            try:
                username = fake.user_name()
                password = fake.password()
                
                if not User.query.filter_by(username=username).first():
                    user = User(username=username, password=password)
                    db.session.add(user)
                    users.append(user)
                    break
            except:
                db.session.rollback()
                continue
    db.session.commit()
    return users

def generate_recipes(users, n=30):
    """Generate n fake recipes assigned to random users"""
    recipes = []
    for _ in range(n):
        user = random.choice(users)
        name = f"{fake.word().capitalize()} {fake.word()} Recipe"
        ingredients = ", ".join(fake.words(nb=5))
        recipe = Recipe(name=name, ingredients=ingredients, user_id=user.id)
        recipes.append(recipe)
    return recipes

def generate_meals(users, recipes, n=30):
    """Generate n fake meal plans with random users and recipes"""
    meals = []
    valid_recipes = [r for r in recipes if r.id is not None]  
    if not valid_recipes:
        raise ValueError("No valid recipes with IDs available")
        
    for _ in range(n):
        user = random.choice(users)
        recipe = random.choice(valid_recipes)
        meal_name = f"{fake.word().capitalize()} Meal Plan"
        date = fake.date_between(start_date='-1y', end_date='today')
        meal = Meal(
            name=meal_name,
            date=date,
            user_id=user.id,
            recipe_id=recipe.id  
        )
        meals.append(meal)
    return meals

def seed_db():
    """Main function to seed the database"""
    with app.app_context():
      
        db.drop_all()
        db.create_all()

        
        users = generate_users()
        db.session.bulk_save_objects(users)
        db.session.commit()  
        
        recipes = generate_recipes(users)
        
        for recipe in recipes:
            db.session.add(recipe)
            db.session.flush()  
        
        meals = generate_meals(users, recipes)
        
        for meal in meals:
            db.session.add(meal)
        
        db.session.commit()
        print(f"Database seeded with {len(users)} users, {len(recipes)} recipes, and {len(meals)} meals")

if _name_ == "_main_":
    seed_db()