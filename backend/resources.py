from flask import request, current_app as app
from flask_restful import Api, Resource, fields, marshal_with
from flask_security import auth_required, roles_required, current_user
from backend.models import Service, db

cache = app.cache

api = Api(prefix='/api')

service_fields = {
    "id": fields.Integer,
    "name": fields.String,
    "price": fields.Integer,
    "time_required": fields.String,
    "description": fields.String,
}

class Services(Resource):
    @auth_required('token')
    @cache.cached(timeout = 5, key_prefix = "services")
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
    @cache.memoize(timeout = 5)
    @marshal_with(service_fields)
    def get(self, name):
        servname = Service.query.filter_by(name=name).first()

        if not servname:
            return {"message" : "not found"}, 404
        return servname
    
    
api.add_resource(Services, "/services")
api.add_resource(Servicename, "/service/<string:name>")