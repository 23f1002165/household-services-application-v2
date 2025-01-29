from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()

class Customer(db.Model, UserMixin):
    __tablename__ = 'customer'
    id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    email_id=db.Column(db.String, unique=True, nullable=False)
    customer_password=db.Column(db.String, nullable=False)
    customer_fullname=db.Column(db.String, nullable=False)
    customer_address=db.Column(db.String, nullable=False)
    customer_pin_code=db.Column(db.String, nullable=False)
    customer_phone_no=db.Column(db.String, nullable=False)
    admin=db.Column(db.Boolean, default=0)
    customer_status=db.Column(db.String, default="Active")
    fs_uniqufier=db.Column(db.String, unique=True, nullable=False)
    service_history=db.relationship('ServiceRequest', backref='customer', lazy=True)

class Service(db.Model, RoleMixin):
    __tablename__='service'
    id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    service_name=db.Column(db.String, nullable=False, unique=True)
    description=db.Column(db.String, nullable=False)
    price=db.Column(db.Float, nullable=False)
    review=db.Column(db.Float, default=0, nullable=False)
    professionals=db.relationship('Professional', backref='service', cascade='all, delete')
    requests=db.relationship('ServiceRequest', backref='service', cascade='all, delete', lazy=True)

class Professional(db.Model, UserMixin):
    __tablename__ = 'professional'
    id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    email_id=db.Column(db.String, unique=True, nullable=False)
    professional_password=db.Column(db.String, nullable=False)
    professional_fullname=db.Column(db.String, nullable=False)
    service_name=db.Column(db.String, db.ForeignKey('service.service_name', ondelete='CASCADE'), nullable=False)
    experience=db.Column(db.Float, nullable=False)
    documents=db.Column(db.String, nullable=False)
    professional_address=db.Column(db.String, nullable=False)
    professional_pin_code=db.Column(db.String, nullable=False)
    professional_phone_no=db.Column(db.String, nullable=False)
    professional_status=db.Column(db.String, default="Inprocess")
    accepted_service=db.Column(db.Integer, default=0)
    rejected_service=db.Column(db.Integer, default=0)
    closed_service=db.Column(db.Integer, default=0)
    services=db.relationship('ServiceRequest', backref='professional', lazy=True)

class ServiceRequest(db.Model):
    __tablename__ = 'service_request'
    id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    service_id=db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    customer_id=db.Column(db.String, db.ForeignKey('customer.email_id'), nullable=False)
    professional_id=db.Column(db.String, db.ForeignKey('professional.email_id', ondelete='SET NULL'), default='Not Assigned', nullable=True)
    requested_dt=db.Column(db.DateTime, nullable=False)
    status=db.Column(db.String, default='Requested')
    ratings=db.relationship('ServiceRemark', backref='service_request', cascade='all, delete', uselist=False, lazy=True)

class ServiceRemark(db.Model):
    __tablename__ = 'service_remark'
    id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    service_request_id=db.Column(db.Integer, db.ForeignKey('service_request.id'), unique=True, nullable=False)
    service_rating=db.Column(db.Integer, nullable=False)
    remarks=db.Column(db.Text, default='N/A')