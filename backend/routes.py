from flask import current_app as app, jsonify, request, render_template, send_file
from flask_security import verify_password, hash_password
from backend.models import db
from datetime import datetime
from backend.celery.tasks import create_csv
from celery.result import AsyncResult

datastore = app.security.datastore
cache = app.cache

@app.get('/')
def home():
    return render_template('index.html')
    
@app.get('/create-csv')
def createCSV():
    task = create_csv.delay()
    return {'task_id' : task.id}, 200

@app.get('/get-csv/<id>')
def getCSV(id):
    result = AsyncResult(id)

    if result.ready():
        return send_file(f'./backend/celery/user-downloads/{result.result}'), 200
    else:
        return {'message' : 'task not ready'}, 405

@app.post('/login')
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"message": "Email or Password Not Provided"}), 404

    user = datastore.find_user(email=email)
    if not user:
        return jsonify({"message": "User Not Found"}), 404

    if verify_password(password, user.password):
        return jsonify(
            {
                "id": user.id,
                "token": user.get_auth_token(),
                "email": user.email,
                "role": user.roles[0].name,
                "active": user.active,
            }
        )
    return jsonify({"message": "Wrong Password"}), 400

@app.post('/register')
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not email or not password or role not in ['Admin', 'User', 'Professional']:
        return jsonify({"message" : "invalid inputs"}), 404
    
    user = datastore.find_user(email = email)
    if user:
        return jsonify({"message" : "user already exists"}), 404

    try :
        datastore.create_user(email = email, password = hash_password(password), username = email, address = email, pincode = email, phone_number = email, roles = [role], active = True)
        db.session.commit()
        return jsonify({"message" : "user created"}), 200
    except:
        db.session.rollback()
        return jsonify({"message" : "error creating user"}), 400