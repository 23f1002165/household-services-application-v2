from flask import current_app as app
from models import db
from flask_security import SQLAlchemyUserDatastore, hash_password

with app.app_context():
    db.create_all()
    userdatastore: SQLAlchemyUserDatastore=app.security.datastore
    userdatastore.find_or_create_role(service_name='Sink Drainage Removal', description='Kitchen', price=899.0)
    if not (userdatastore.find_user(email_id='admin@iitm.ac.in')):
        userdatastore.create_user(email_id='admin@iitm.ac.in', customer_password=hash_password('admin@2023'), customer_fullname='Administrative IITM', customer_address='IIT Madras', customer_pin_code='600036', customer_phone_no='7850999966', admin=1)
    db.session.commit()