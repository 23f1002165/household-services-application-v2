import requests
GOOGLE_CHAT_WEBHOOK = "https://chat.googleapis.com/v1/spaces/AAAA_opZ7Ew/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=Tni9OKSnqgJQCuuDwV5FwXjIrD5tGL4eSpnHg3rrozQ"

def send_gchat_reminder(message):
    payload = {"text": message}
    response = requests.post(GOOGLE_CHAT_WEBHOOK, json=payload)
    return response.status_code

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
SMTP_SERVER = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = 'noreply@householdservices.com'
SENDER_PASSWORD = ''

def send_email(to, subject, html_body):
    msg = MIMEMultipart()
    msg['To'] = to
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL

    msg.attach(MIMEText(html_body,'html'))

    with smtplib.SMTP(host=SMTP_SERVER, port=SMTP_PORT) as client:
        client.send_message(msg)
        client.quit()