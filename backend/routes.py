from flask import current_app as app, jsonify, request, render_template, send_file
from flask_security import auth_required, verify_password, hash_password
from backend.models import Service, db
from datetime import datetime
from backend.celery.tasks import create_csv
from celery.result import AsyncResult

datastore = app.security.datastore
cache = app.cache

@app.get('/')
def home():
    return render_template('index.html')

@auth_required('token')    
@app.get('/create-csv')
def createCSV():
    task = create_csv.delay()
    return {'task_id' : task.id}, 200

@auth_required('token')
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

    user = datastore.find_user(email=email)
    if not user and email and password:
        return jsonify({"message": "You've entered incorrect email ID. Please try again"}), 404

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
    return jsonify({"message": "You've entered incorrect password. Please try again"}), 400

@app.post('/register')
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    phone_number = data.get('phone_number')
    address = data.get('phone_number')
    pincode = data.get('pincode')
    
    user = datastore.find_user(email = email)
    if user:
        return jsonify({"message" : "User already exists"}), 404

    datastore.create_user(email = email, password = hash_password(password), username = username, address = address, pincode = pincode, phone_number = phone_number, roles=['Customer'])
    db.session.commit()
    return jsonify({"message" : "User created"}), 200
    