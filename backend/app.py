import eventlet

eventlet.monkey_patch()

from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
import search_handler as job_parser
import logging
import time
from letter_generator import generate_adapted_letter
from email_sender import send_email
from datetime import timedelta
import os
from db import User, Application, db, init_db
from apscheduler.schedulers.gevent import GeventScheduler

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "OPTIONS"],
)

app.config["SECRET_KEY"] = "secret!"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///applications.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "your-secret-key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

socketio = SocketIO(
    app,
    async_mode="eventlet",
    cors_allowed_origins=["http://localhost:3000"],
    ping_timeout=120,
    ping_interval=30,
)
jwt = JWTManager(app)

scheduler = None


def update_jobs():
    with app.app_context():
        query = "förskollärare"
        location = "Skåne"

        logger.info(f"Starting job search for {query} in {location}")
        start_time = time.time()

        applications = job_parser.aggregate_job_search(f"{query} {location}")

        logger.info(f"Found {len(applications)} applications")
        logger.info(f"Search completed in {time.time() - start_time:.2f} seconds")

        new_applications = Application.save_applications(applications)

        if new_applications:
            logger.info(
                f"Added {len(new_applications)} new applications to the database"
            )
            socketio.emit("new_applications", new_applications)


@socketio.on("connect")
def handle_connect():
    logger.info("Client connected")


@socketio.on("get_applications")
def handle_get_applications():
    try:
        with app.app_context():
            applications = Application.get_all_applications()
            logger.info(f"Sending {len(applications)} initial applications")
            emit("applications", applications)
    except Exception as e:
        logger.error(f"Error in get_applications: {str(e)}")
        emit("error", {"message": "Failed to retrieve applications"})


@socketio.on("disconnect")
def handle_disconnect():
    logger.info("Client disconnected")


@socketio.on("create_letter")
def create_letter(data):
    application_id = data.get("applicationId")
    email = data.get("email", "fatap70141@craftapk.com")

    if not application_id or not email:
        emit("letter_error", {"error": "Missing applicationId or email"})
        return

    with app.app_context():
        application = Application.get_application_by_id(application_id)
        logger.info(f"Application: {application}")
        if not application:
            emit("letter_error", {"error": "Application not found"})
            return

        try:
            adapted_letter = generate_adapted_letter(application)
            send_email(email, "Your Adapted Application Letter", adapted_letter)
            emit("letter_success", {"message": "Letter created and sent successfully"})
        except Exception as e:
            logger.error(f"Error processing letter: {str(e)}")
            emit("letter_error", {"error": "Failed to process letter"})


@socketio.on("register")
def register(data):
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        emit("register_error", {"msg": "Missing username or password"})
        return

    if User.query.filter_by(username=username).first():
        emit("register_error", {"msg": "Username already exists"})
        return

    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    emit("register_success", {"msg": "User created successfully"})


@socketio.on("login")
def login(data):
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity=username)
        emit("login_success", {"access_token": access_token})
    else:
        emit("login_error", {"msg": "Invalid username or password"})


@socketio.on("get_application")
def handle_get_application(data):
    app_id = data["applicationId"]
    application = Application.get_application_by_id(app_id)
    emit("application", application)


@socketio.on("keepalive")
def handle_keepalive():
    emit("keepalive", {"status": "ok"})


@socketio.on_error()
def error_handler(e):
    logger.error(f"SocketIO error: {str(e)}")


@socketio.on_error_default
def default_error_handler(e):
    logger.error(f"SocketIO default error: {str(e)}")


if __name__ == "__main__":
    with app.app_context():
        init_db(app)
        scheduler = GeventScheduler()
        scheduler.add_job(func=update_jobs, trigger="interval", minutes=30)
        scheduler.start()

        update_jobs()

    try:
        # Use eventlet's WSGI server
        import eventlet

        eventlet.wsgi.server(eventlet.listen(("", 5000)), app)
    finally:
        if scheduler and scheduler.running:
            scheduler.shutdown()
