from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from datetime import datetime

db = SQLAlchemy()

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    active = db.Column(db.Boolean, default=True)
    confirmed_at = db.Column(db.DateTime)
    address = db.Column(db.String, nullable=False)
    pincode = db.Column(db.String(6), nullable=False)
    phone_number = db.Column(db.String, nullable=False)
    fs_uniquifier = db.Column(db.String, unique=True, nullable=True)

    roles = db.relationship('Role', backref='users', secondary='user_roles', lazy=True)

class Role(db.Model, RoleMixin):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String, nullable=False)

class UserRoles(db.Model):
    __tablename__ = 'user_roles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))

class ProfessionalProfile(db.Model):
    __tablename__ = 'professional_profiles'
    id = db.Column(db.Integer, primary_key=True)
    professional_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    experience = db.Column(db.Integer, nullable=False)
    service_type_id = db.Column(db.Integer, db.ForeignKey('services.id', ondelete='CASCADE'),nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    documents=db.Column(db.String, nullable=False)

    professional = db.relationship('User', backref='professional', lazy=True, uselist=False)

class Service(db.Model):
    __tablename__ = 'services'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    price = db.Column(db.Float, nullable=False)
    time_required = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=False)

class ServiceRequest(db.Model):
    __tablename__ = 'service_requests'
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    date_of_request = db.Column(db.DateTime, nullable=False)
    date_of_completion = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String, default='requested')
    rating = db.Column(db.Integer)
    comments = db.Column(db.Text)
    review_created_at = db.Column(db.DateTime, default=datetime)

    service = db.relationship('Service', backref='service_requests', lazy=True)
    customer = db.relationship('User', foreign_keys=[customer_id], backref='customer_requests', lazy=True)
    professional = db.relationship('User', foreign_keys=[professional_id], backref='professional_requests', lazy=True)
