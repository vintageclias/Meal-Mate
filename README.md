Setup Instructions
1. Clone the Repo
bash
Copy code
git clone https://github.com/your-username/meal-mate.git
cd meal-mate
2. Backend Setup (Flask)
bash
Copy code
cd backend
pipenv install  # or python -m venv venv && source venv/bin/activate && pip install -r requirements.txt
pipenv shell    # if using pipenv
flask db upgrade
flask run
By default, runs at http://127.0.0.1:5000

3. Frontend Setup (React)
In another terminal:

bash
Copy code
cd frontend
npm install
npm run dev
Runs at http://localhost:5173 and connects to the Flask backend.

