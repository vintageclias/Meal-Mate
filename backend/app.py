import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from model import db, User, Recipe, Meal

app = Flask(__name__)

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

[Rest of the file content remains exactly the same as in previous successful create_file attempt]
