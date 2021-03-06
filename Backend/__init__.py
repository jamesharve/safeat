import os

from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from gevent import monkey

db = SQLAlchemy()
login_manager = LoginManager()


def create_app():
    appl = Flask(__name__, static_folder=os.path.abspath(''))
    appl.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    appl.secret_key = b'"xR\xacBR\xcbx\xc4\xf6\x06\x06y\xcc\x9c\x19'
    appl.config['MAX_CONTENT_LENGTH'] = 32 * 1024 * 1024

    if os.environ.get('SAFEAT_ACCEPTANCE_TEST') is not None:
        appl.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://user_1:&Q?kXvA7XQ@159.203.34.38:3306/safeat_prod'
    else:
        appl.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://user_1:&Q?kXvA7XQ@159.203.34.38:3306/safeat'

    cors = CORS(appl,
                origins=["http://localhost:3000", "http://localhost:*"],
                headers=['Content-Type'],
                expose_headers=['Access-Control-Allow-Origin'],
                supports_credentials=True)

    db.init_app(appl)
    login_manager.init_app(appl)
    monkey.patch_all()

    with appl.app_context():
        from Backend.Blueprints.Errors import errors
        from Backend.Blueprints.Login import login
        from Backend.Blueprints.Restaurants import restaurants
        from Backend.Blueprints.Search import search
        from Backend.Blueprints.Users import users
        from Backend.Blueprints.Menu import menu
        from Backend.Blueprints.Transactions import transactions
        from Backend.Blueprints.Tracing import tracing
        from Backend.Blueprints.Payment import payment
        from Backend.Blueprints.Misc import misc

        appl.register_blueprint(errors.error_bp)
        appl.register_blueprint(login.login_bp)
        appl.register_blueprint(restaurants.restaurant_bp)
        appl.register_blueprint(search.search_bp)
        appl.register_blueprint(users.users_bp)
        appl.register_blueprint(menu.menu_bp)
        appl.register_blueprint(transactions.transaction_bp)
        appl.register_blueprint(tracing.tracing_bp)
        appl.register_blueprint(payment.payment_bp)
        appl.register_blueprint(misc.misc_bp)

        return appl
