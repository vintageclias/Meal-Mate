from app import app, db
from model import User
from werkzeug.security import generate_password_hash

with app.app_context():
    # Delete existing test user if present
    User.query.filter_by(email='test@example.com').delete()
    db.session.commit()
    
    # Create new test user with correct password
    test_user = User(
        username='testuser',
        email='test@example.com',
        password=generate_password_hash('password123')
    )
    db.session.add(test_user)
    db.session.commit()
    print("Test user reset with password 'password123'")
