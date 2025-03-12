# Household Services Application - V2

This is a Household Services Application built with Flask and Vue.js, supporting user roles such as Admin, Service Professional, and Customer. The backend uses Flask, Celery for task scheduling, Redis as a message broker, and MailHog for email testing.

## Features

### Architecture and Features

- **User Roles**: Three primary roles—Admin, Service Professional, and Customer—with role-based access control (RBAC).
- **Authentication System**: Secure login and registration using token-based authentication.
- **Customer Features**: Search for services by location, name, or pin code. Browse ratings and reviews before booking a service.
- **Professional Features**: Accept/reject service requests, mark them as completed, receive automated reminders, and initiate services using an OTP.
- **Admin Features**: Manage services, search for professionals, and block/unblock users if necessary.
- **OTP-Based Service Initiation**: Customers receive a one-time password (OTP) when starting a service request. Professionals must enter the OTP to complete the service, ensuring authenticity.
- **Dummy Payment Portal**: Implemented a dummy payment portal that takes payment details from customers for a service request.
- **Automated Email Reports**: Celery generates and sends monthly activity reports to customers.
- **Task Scheduling**: Celery Beat automates periodic tasks like report generation and email distribution.
- **Performance Optimization**: Redis caching enhances API performance and reduces response time.
- **Analytics Reports**: Admins can view detailed service usage and customer feedback insights.

## Setup & Installation

### 1. Create a Virtual Environment
```sh
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install Backend Dependencies
```sh
pip install -r requirements.txt
```

## Running the Application

### 1. Start Redis Server
```sh
redis-server
```

### 2. Start MailHog (for email testing)
```sh
~/go/bin/MailHog
```
Access MailHog at: [http://localhost:8025](http://localhost:8025)

### 3. Start Flask Backend
```sh
python3 app.py
```
The API will be available at [http://127.0.0.1:5000](http://127.0.0.1:5000)

### 4. Start Celery Worker
```sh
celery -A app:celery_app worker -l INFO
```

### 5. Start Celery Beat (for periodic tasks)
```sh
celery -A app:celery_app beat -l INFO
```

## Testing the Setup

Once everything is running, you can:

- Register as a user and log in.
- Book a service and manage requests.
- Check emails via MailHog.
- Verify Celery task execution.
