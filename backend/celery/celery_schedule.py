from celery.schedules import crontab
from flask import current_app as app

celery_app = app.extensions['celery']

celery_app.conf.beat_schedule = {
    "send_service_reminders": {
        "task": "backend.celery.tasks.send_service_reminders",
        "schedule": crontab(hour=18, minute=0),
    },
    "send_monthly_reports": {
        "task": "backend.celery.tasks.send_monthly_report",
        "schedule": crontab(day_of_month=1, hour=18, minute=0),
    }
}
