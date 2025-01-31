from flask import current_app as app
from flask_security import SQLAlchemyUserDatastore, hash_password
from backend.models import db, User, Role, ProfessionalProfile, Service, ServiceRequest

with app.app_context():
    db.create_all()

    userdatastore : SQLAlchemyUserDatastore = app.security.datastore

    userdatastore.find_or_create_role(name='Admin', description='Administrator role')
    userdatastore.find_or_create_role(name='Customer', description='Customer role')
    userdatastore.find_or_create_role(name='Professional', description='Professional role')

    if not Service.query.filter_by(name='Plumbing').first():
        plumbing_service = Service(name='Plumbing', price=100.0, time_required=60, description='Fixing leaks and pipes')
        db.session.add(plumbing_service)
    db.session.commit()

    if not userdatastore.find_user(email='admin@iitm.ac.in'):
        userdatastore.create_user(email='admin@iitm.ac.in', password=hash_password('admin@2023'), username='Admin IITM', address='IIT Madras', pincode='600036', phone_number='7850999966', roles=['Admin'])
    
    if not userdatastore.find_user(email='customer@iitm.ac.in'):
        userdatastore.create_user(email='customer@iitm.ac.in', password=hash_password('customer@2023'), username='Customer IITM', address='IIT Madras', pincode='600036', phone_number='7850999977', roles=['Customer'])

    professional=False
    if not userdatastore.find_user(email='professional@iitm.ac.in'):
        professional_user=userdatastore.create_user(email='professional@iitm.ac.in', password=hash_password('professional@2023'), username='Professional IITM', address='IIT Madras', pincode='600036', phone_number='7850999988', roles=['Professional'])
        professional=True
    db.session.commit()

    if professional:
        professional_profile = ProfessionalProfile(professional_id=professional_user.id, experience=5, service_type_id=1, is_verified=True, documents='plumbing_certificate.pdf')
        db.session.add(professional_profile)

    db.session.commit()
