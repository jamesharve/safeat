import json
import os

from flask import Blueprint
from sqlalchemy.orm import sessionmaker

from Backend import db

misc_bp = Blueprint('misc_bp', __name__)


@misc_bp.route('/Api/Dump', methods=['POST'])
def webhook():
    session = sessionmaker(bind=db.engine)()
    try:
        if os.environ.get('SAFEAT_ACCEPTANCE_TEST') is not None:
            # disabled foreign key checks
            session.execute('SET FOREIGN_KEY_CHECKS=0')
            # delete all data that was inserted in acceptance test
            session.execute('delete from menu_item where id > 5')
            session.execute('delete from order_log')
            session.execute('delete from restaurant where id > 7')
            session.execute('delete from staff')
            session.execute('delete from tag_log where id > 4')
            session.execute('delete from transaction')
            session.execute('delete from user where id > 5')
            # re enable checks
            session.execute('SET FOREIGN_KEY_CHECKS=1')
        else:
            raise Exception

        session.commit()
    except Exception as error:
        session.rollback()
        session.close()
        return json.dumps({'success': False, 'error': str(error)}), 500, {'ContentType': 'application/json'}

    session.close()
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
