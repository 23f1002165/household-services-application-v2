from celery import shared_task
import time
import flask_excel
from backend.models import Service
from backend.celery.mail_service import send_email
    
@shared_task(bind = True, ignore_result = False)
def create_csv(self):
    resource = Service.query.all()
    filename = f'Service_data.csv'
    column_names = [column.name for column in Service.__table__.columns]
    csv_out = flask_excel.make_response_from_query_sets(resource, column_names = column_names, file_type='csv' )

    with open(f'./backend/celery/user-downloads/{filename}', 'wb') as file:
        file.write(csv_out.data)
    return 'Service_data.csv'

@shared_task(ignore_result = True)
def email_reminder(to, subject, content):
    send_email(to, subject, content)