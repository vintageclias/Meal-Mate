from app import app
from model import db, User

with app.app_context():
    users = User.query.all()
    print("Users in database:")
    for user in users:
        print(f"ID: {user.id}, Username: {user.username}, Email: {user.email}")
