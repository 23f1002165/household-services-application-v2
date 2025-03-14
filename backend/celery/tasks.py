from celery import shared_task
import flask_excel
from backend.models import User, Role, Service, ServiceRequest, db
from backend.celery.mail_service import send_gchat_reminder, send_email 
from flask import render_template
from datetime import datetime, timedelta
import os
    
@shared_task(bind = True, ignore_result = False)
def create_csv(self):
    resource = ServiceRequest.query.all()
    filename = f'ServiceRequest_data.csv'
    column_names = [column.name for column in ServiceRequest.__table__.columns]
    csv_out = flask_excel.make_response_from_query_sets(resource, column_names = column_names, file_type='csv' )

    with open(f'./backend/celery/user_downloads/{filename}', 'wb') as file:
        file.write(csv_out.data)
    return 'ServiceRequest_data.csv'

@shared_task
def send_service_reminders():
    pending_requests = ServiceRequest.query.filter(ServiceRequest.status == "assigned").all()
    req_requests = (
        db.session.query(
            ServiceRequest.id, 
            ServiceRequest.service_id, 
            ServiceRequest.status
        )
        .join(Service, ServiceRequest.service_id == Service.id)
        .filter(ServiceRequest.status == "requested")
        .group_by(Service.name)
        .all()
    )
    if not pending_requests and not req_requests:
        return "No pending service requests for today."

    for request in pending_requests:
        professional = User.query.get(request.professional_id)
        message = (
        f"Dear { professional.username },\n\n"
        f"Your service request for {request.service.name} is still {request.status}. "
        f"Please take necessary action.\n\n"
        f"Best regards,\n"
        f"A to Z Household Services"
        )
        send_gchat_reminder(message)

    for request in req_requests:
        service = Service.query.get(request.service_id)
        message = (
            f"Dear { service.name } professionals,\n\n"
            f"New service requests are awaiting your response! Please log in to the application to review them and take action.\n"
            f"Delivering services on time keeps customers happy—we appreciate your efforts!\n\n"
            f"Best regards,\n"
            f"A to Z Household Services"
        )

        send_gchat_reminder(message)

    return "Reminders sent successfully!"

@shared_task
def send_monthly_report():
    today = datetime.today()
    first_day_last_month = (today.replace(day=1) - timedelta(days=1)).replace(day=1)

    customers = User.query.filter(User.active == True, User.roles.any(Role.name == "Customer")).all()

    for customer in customers:
        requests = [
            r for r in ServiceRequest.query.filter(ServiceRequest.customer_id == customer.id).all()
            if first_day_last_month <= datetime.strptime(r.date_of_request.split()[0], "%Y-%m-%d") <= today
        ]
        
        total_requested = sum(1 for r in requests if r.status in {"requested", "assigned", "declined", "started", "completed"})
        total_closed = sum(1 for r in requests if r.status in {"closed", "cancelled"})
        total_services = len(requests)
        

        html_content = render_template(
            "monthly_report.html",
            customer=customer,
            total_requested=total_requested,
            total_closed=total_closed,
            total_services=total_services,
            requests=requests
        )
        send_email(
            to=customer.email,
            subject="Your Monthly Activity Report",
            html_body=html_content
        )

    return "Monthly reports sent successfully."
