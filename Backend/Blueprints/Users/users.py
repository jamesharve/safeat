import json

from flask import Blueprint, request
from flask_login import current_user
from sqlalchemy.orm import sessionmaker
from werkzeug.security import generate_password_hash

from Backend import db
from Backend.Models.user import User
from Backend.Utilities import jwt_tools

users_bp = Blueprint('users__bp', __name__)

"""
Endpoint expects to be fed an object with four parameters
@name:        The name of the user or restaurant
@email:       The email of the user or restaurant
@password:    The password of the user or restaurant
@phone:       The phone num of the user or restaurant
If the field is an empty string than it will not be updated
"""


@users_bp.route('/Api/User/Update', methods=['POST'])
def user_update():
    session = sessionmaker(bind=db.engine)()

    try:
        parameters = request.json
        data = jwt_tools.decode(parameters['cookies'])
        # Update users name
        if parameters['name'] != "":
            session.query(User).filter(User.id == data['id']).update({'name': parameters['name']})
        # Update email
        if parameters['email'] != "":
            session.query(User).filter(User.id == data['id']).update({'email': parameters['email']})
        # Update password
        if parameters['password'] != "":
            session.query(User).filter(User.id == data['id']).update(
                {'password': generate_password_hash(parameters['password'])})
        # Update phone
        if parameters['phone'] != "":
            session.query(User).filter(User.id == data['id']).update({'phone': parameters['phone']})

        enc_jwt = jwt_tools.encode(data)
        session.commit()

    except LookupError:
        session.rollback()
        session.close()
        return json.dumps({'success': False, 'error': 'Session Timout'}), \
               403, {'ContentType': 'application/json'}

    except Exception as error:
        session.rollback()
        session.close()
        return json.dumps({'success': False, 'error': str(error)}), 500, {'ContentType': 'application/json'}

    session.close()
    return json.dumps({'success': True, 'jwt_token': enc_jwt}), 200, {'ContentType': 'application/json'}


"""
Endpoint expects no parameters
Endpoint will deactivate user or restaurant if requested. Will also log them out upon completion
"""


@users_bp.route('/Api/User/Deactivate', methods=['POST'])
def user_deactivate():
    session = sessionmaker(bind=db.engine)()

    try:
        parameters = request.json
        data = jwt_tools.decode(parameters['cookies'])

        session.execute('update user set active = 0 where id = :id', {'id': data['id']})

        if current_user.restaurant is not None:
            session.execute('update restaurant set active = 0 '
                            'where id = (select restaurant from user where id =:id and active = 1)',
                            {'id': data['id']})

        session.commit()

    except LookupError:
        session.rollback()
        session.close()
        return json.dumps({'success': False, 'error': 'Session Timeout'}), \
               403, {'ContentType': 'application/json'}

    except Exception as error:
        session.rollback()
        session.close()
        return json.dumps({'success': False, 'error': str(error)}), 500, {'ContentType': 'application/json'}

    session.close()
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


"""
Endpoint expects only one param
@cookies   A dictionary of cookies from the client
@returns whether or not the token is valid and active
"""


@users_bp.route('/Api/User/Test', methods=['POST'])
def user_test():
    try:
        parameters = request.json
        jwt_tools.decode(parameters['cookies'])

    except Exception as error:
        return json.dumps({'success': False, 'error': str(error)}), \
               403, {'ContentType': 'application/json'}

    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
