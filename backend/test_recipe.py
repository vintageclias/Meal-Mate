from app import app, db, Recipe

with app.app_context():
    # Create test recipe
    r = Recipe(
        title='Pasta Carbonara',
        ingredients='Pasta, Eggs, Cheese, Bacon',
        instructions='Cook pasta, mix with other ingredients',
        user_id=5
    )
    db.session.add(r)
    db.session.commit()
    print(f'Created recipe ID: {r.id}')

    # Verify creation
    recipes = Recipe.query.all()
    print(f'Existing recipes: {[recipe.id for recipe in recipes]}')
