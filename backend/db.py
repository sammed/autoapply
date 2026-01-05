import os
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import json
import logging

db = SQLAlchemy()
bcrypt = Bcrypt()

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __init__(self, username, password):
        self.username = username
        self.password = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    @classmethod
    def get_all_usernames_and_passwords(cls):
        users = cls.query.all()
        return [(user.username, user.password) for user in users]

    @classmethod
    def delete_by_username(cls, username: str):
        users_to_delete = cls.query.filter_by(username=username).all()
        if not users_to_delete:
            return f"No user found with username {username}"
        for user in users_to_delete:
            db.session.delete(user)
        db.session.commit()
        return f"Successfully deleted {len(users_to_delete)} user(s) with username {username}"


class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    external_id = db.Column(db.String(120), unique=True, nullable=False)
    headline = db.Column(db.String(200), nullable=False)
    employer = db.Column(db.String(100))
    location = db.Column(db.Text)
    application_deadline = db.Column(db.String(50))
    description = db.Column(db.Text)
    source = db.Column(db.String(100))
    data = db.Column(db.Text)

    @classmethod
    def save_applications(cls, applications):
        new_applications = []
        for app in applications:
            data = app["data"]
            new_app = cls(
                external_id=data.get("id"),
                headline=data.get("headline"),
                employer=data.get("employer", {}).get("name"),
                location=json.dumps(data.get("workplace_address", {})),
                application_deadline=data.get("application_deadline"),
                description=data.get("description", {}).get("text"),
                source=app.get("source"),
                data=json.dumps(data),
            )
            db.session.add(new_app)
            try:
                db.session.flush()
                new_applications.append(new_app.format())
            except:
                db.session.rollback()
        db.session.commit()
        return new_applications

    @classmethod
    def get_all_applications(cls):
        applications = cls.query.all()
        logger.debug(f"Retrieved {len(applications)} applications from the database")
        return [app.format() for app in applications]

    @classmethod
    def get_application_by_id(cls, application_id):
        app = cls.query.get(application_id)
        return app.format() if app else None

    def format(self):
        return {
            "id": self.id,
            "external_id": self.external_id,
            "headline": self.headline,
            "employer": self.employer,
            "location": json.loads(self.location),
            "application_deadline": self.application_deadline,
            "description": self.description,
            "source": self.source,
            "data": json.loads(self.data),
        }


def init_db(app):
    db.init_app(app)
    bcrypt.init_app(app)

    with app.app_context():
        db.create_all()

        default_username = os.getenv("DEFAULT_ADMIN_USERNAME")
        default_password = os.getenv("DEFAULT_ADMIN_PASSWORD")

        if not default_username or not default_password:
            logger.warning(
                "Default admin credentials not set in environment variables."
            )
            return

        if not User.query.filter_by(username=default_username).first():
            hashed_pw = bcrypt.generate_password_hash(default_password).decode("utf-8")
            default_user = User(username=default_username, password=hashed_pw)
            db.session.add(default_user)
            db.session.commit()
            logger.info(f"Default user '{default_username}' created.")
        else:
            logger.info("Default admin user already exists.")
