from flask_login import UserMixin
from Backend import db
from werkzeug.security import generate_password_hash, check_password_hash


class Tags(UserMixin, db.Model):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False, unique=False)
    created_on = db.Column(db.DateTime, index=False, unique=False, nullable=True)

    active = db.Column(db.Boolean, index=False, unique=False, nullable=False)