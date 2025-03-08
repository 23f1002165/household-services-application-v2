from flask import current_app as app, jsonify, request, render_template, send_file, send_from_directory
from flask_security import auth_required, verify_password, hash_password, roles_required
from backend.models import User, Service, ProfessionalProfile, ServiceRequest, db
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

@app.route('/uploads/<filename>')
@auth_required('token')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

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

@app.post('/re_verify')
def re_verify():
    data = request.get_json()
    id  = data.get('id')
    customer = User.query.get(id)
    customer.active = False
    db.session.commit()
    return {"message": "Professional Request Sent for Approval"}, 200
    
@app.get("/status/customer/<int:id>")
@auth_required("token")
@roles_required("Admin")
def status_customer(id):
    today = datetime.now().strftime("%d/%m/%Y %I:%M %p")
    customer = User.query.get(id)
    if customer.active:
        requests = ServiceRequest.query.filter(ServiceRequest.customer_id == id).all()
        for req in requests:
            if (req.status == 'requested' or req.status == 'assigned' or req.status == 'declined'):
                req.status = 'cancelled'
                req.date_of_completion = today
            elif (req.status == 'started' or req.status == 'completed'):
                req.rating = 5
                req.review_created_at = today
                req.status = 'closed'
    customer.active = not customer.active
    db.session.commit()
    status = "Activated" if customer.active else "Deactivated"
    return jsonify({"message": f"Customer {status}"})

@app.get("/verify/professional/<int:id>")
@auth_required("token")
@roles_required("Admin")
def verify_professional(id):
    today = datetime.now().strftime("%d/%m/%Y %I:%M %p")
    customer = User.query.get(id)
    customer.active = True
    professional = ProfessionalProfile.query.filter_by(professional_id=id).first()
    professional.is_verified = True
    #professional.confirmed_at = today
    db.session.commit()
    return jsonify({"message": "Professional successfully verified"})

@app.get("/deny/professional/<int:id>")
@auth_required("token")
@roles_required("Admin")
def deny_professional(id):
    professional = ProfessionalProfile.query.filter_by(professional_id=id).first()
    professional.is_verified = False
    db.session.commit()
    return jsonify({"message": "Professional approval refused"})

@app.get("/status/professional/<int:id>")
@auth_required("token")
@roles_required("Admin")
def status_professional(id):
    professional = User.query.get(id)
    if professional.active:
        requests = ServiceRequest.query.filter(ServiceRequest.professional_id == id).all()
        for req in requests:
            if (req.status == 'assigned' or req.status == 'started'):
                req.status = 'declined'
    professional.active = not professional.active
    db.session.commit()
    status = "Activated" if professional.active else "Deactivated"
    return jsonify({"message": f"Professional {status}"})