from flask import Flask
from backend.config import LocalDevelopmentConfig
from backend.models import db, Customer, Service, Professional
from flask_security import Security, SQLAlchemyUserDatastore, auth_required

def createApp():
    app=Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    datastore=SQLAlchemyUserDatastore(db, Customer, Professional, Service)
    app.security=Security(app, datastore=datastore)
    app.app_content().push()
    return app
app=createApp()
import backend.create_initial_data

@app.get('/')
def home():
    return '<h1>Home</h1>'
@app.get('/protected')
@auth_required()
def auth_user():
    return '<h1>Auth User </h1>'

if (__name__=='__main__'):
    app.run()