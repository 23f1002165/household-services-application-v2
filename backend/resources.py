from flask import request, current_app as app
from flask_restful import Api, Resource, fields, marshal_with
from flask_security import SQLAlchemyUserDatastore, hash_password, auth_required, roles_required, current_user
from backend.models import User, Service, ProfessionalProfile, ServiceRequest, db
from datetime import datetime

cache = app.cache
userdatastore : SQLAlchemyUserDatastore = app.security.datastore
api = Api(prefix='/api')

service_fields = {
    "id": fields.Integer,
    "name": fields.String,
    "price": fields.Integer,
    "time_required": fields.String,
    "description": fields.String,
}

class Services(Resource):
    #@cache.cached(timeout = 5, key_prefix = "services")
    @marshal_with(service_fields)
    def get(self):
        all_services = Service.query.all()
        return all_services
    
    @auth_required('token')
    @roles_required("Admin")
    def post(self):
        data = request.get_json()
        name = data.get('name')
        price = data.get('price')
        time_required = data.get('time_required')
        description = data.get('description')
        service = Service(name=name, price=price, time_required=time_required, description=description)
        db.session.add(service)
        db.session.commit()
        return {"message": "Service Created"}
    
class Servicename(Resource):
    @auth_required('token')
    #@cache.memoize(timeout = 5)
    @marshal_with(service_fields)
    def get(self, name):
        servname = Service.query.filter(Service.name.ilike(name)).first()

        if not servname:
            return {"message" : "Service not found"}, 404
        
        return servname
    
servicerequest_fields = {
    "id": fields.Integer,
    "service_id": fields.Integer,
    "customer_id": fields.Integer,
    "date_of_request": fields.String,
    "status": fields.String,
    "service": fields.Nested(service_fields),
}
    
class ServiceRequests(Resource):
    @auth_required("token")
    @marshal_with(servicerequest_fields)
    def get(self, customer_id):
        all_requests = ServiceRequest.query.filter_by(customer_id=customer_id).all()
        return all_requests
    
    @auth_required("token")
    def post(self):
        data = request.get_json()
        service_id = data.get('service_id')
        customer_id = data.get('customer_id')
        date_of_request = data.get('date_of_request')
        service_request = ServiceRequest(service_id=service_id, customer_id=customer_id, date_of_request=date_of_request)
        db.session.add(service_request)
        db.session.commit()
        return {"message": "Service Request Added"}
    
class EditServiceRequest(Resource):
    @auth_required("token")
    def post(self, id):
        data = request.get_json()
        service_request = ServiceRequest.query.get(id)
        service_request.professional_id = data.get('professional_id')
        service_request.date_of_request = data.get('date_of_request')
        service_request.date_of_completion = data.get('date_of_completion')
        service_request.status = data.get('status')
        db.session.commit()
        return {"message": "Service Request Closed"}

professional_fields = {
    "professional_id": fields.Integer,
    "experience": fields.Integer,
    "service_type_id": fields.Integer,
    "documents": fields.String,
}

class Professional(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        phone_number = data.get('phone_number')
        address = data.get('phone_number')
        pincode = data.get('pincode')
        service_type_id = data.get('service_type_id')
        experience = data.get('experience')
        documents = data.get('documents')
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return {"message": "User already exists"}, 400
        userdatastore.create_user(email=email, password=hash_password(password), username=username, address=address, pincode=pincode, phone_number=phone_number, roles=['Professional'])
        id = User.query.filter_by(email=email).first().id
        professional_id = id
        professional = ProfessionalProfile(professional_id=professional_id, experience=experience, service_type_id=service_type_id, documents=documents)
        db.session.add(professional)
        db.session.commit()
        return {"message": "Professional Request Sent for Approval"}
    
customer_fields = {
    "email": fields.String,
    "username": fields.String,
    "address": fields.String,
    "pincode": fields.String,
    "phone_number": fields.String,
}
    
servicerequestprof_fields = {
    "id": fields.Integer,
    "service_id": fields.Integer,
    "professional_id": fields.Integer,
    "customer_id": fields.Integer,
    "date_of_request": fields.String,
    "status": fields.String,
    "service": fields.Nested(service_fields),
    "customer": fields.Nested(customer_fields),
}
    
class ServiceRequestProf(Resource):
    @auth_required("token")
    @marshal_with(servicerequestprof_fields)
    def get(self, id):
        profile = ProfessionalProfile.query.filter_by(professional_id=id).first()
        servrequests = ServiceRequest.query.filter_by(service_id=profile.service_type_id).all()
        return servrequests

api.add_resource(Services, "/services")
api.add_resource(Servicename, "/service/<string:name>")
api.add_resource(ServiceRequests, "/request/service/<int:customer_id>", "/request/service")
api.add_resource(EditServiceRequest, "/request/edit/<int:id>")
api.add_resource(Professional, "/professional/register")
api.add_resource(ServiceRequestProf, "/servicerequest/<int:id>")
