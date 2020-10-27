from flask import Flask, request, jsonify, make_response, render_template
from flask_cors import CORS
from bin_packing.packing import packing_algo

from time import sleep
import psycopg2
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from helpers import parseInt, id_to_order, date_difference

app = Flask(__name__, static_folder="build/static", template_folder="build")
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://pack:pgpw@db:5432/pack"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
db = SQLAlchemy(app)


class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.JSON())
    created_at = db.Column(db.DateTime, nullable=False)

    def get_order(order_id):
        return Orders.query.filter_by(id=order_id).first()

    def create_order(order):
        new_order = Orders(id=order['id'], data=order, created_at=datetime.utcnow())
        db.session.add(new_order)
        db.session.commit()

    def get_all_orders():
        return [order.data for order in Orders.query.all()]

    def get_recent_orders():
        orders = Orders.query.order_by((Orders.created_at).desc()).limit(6)    
        return [{"id": order.id, "created_at": order.created_at} for order in orders]
    
    def remove_order(order_id):
        Orders.query.filter_by(id=order_id).delete()
        db.session.commit()

    def remove_all_orders():
        Orders.query.delete()
        db.session.commit()

    def __repr__(self):
        return '<Order %r>' % self.id

class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

@app.route('/api/order/<id>', methods=['GET'])
def get_order(id):
    order_id = parseInt(id)
    if(not order_id):
        raise InvalidUsage('{} is not a valid order number'.format(id), status_code=404)
    
    order = Orders.get_order(order_id)
    if(not order):
        raise InvalidUsage('Order {} not found'.format(id), status_code=404)

    boxes = packing_algo(order.data)
    boxes["original"] = order.data["boxes"]
    return jsonify(boxes)

@app.route('/api/order/<int:order_id>/labels', methods=['POST'])
def print_labels(order_id):
    boxes = request.json
    labels = {'labels': len(boxes['boxes'])}
    response = jsonify(labels)
    sleep(1)
    return response

@app.route('/api/orders', methods=['GET'])
def get_orders():
    orders = {'recent_orders': Orders.get_recent_orders()}
    now = datetime.utcnow()
    for order in orders['recent_orders']:
        order['created_at'] = date_difference(order['created_at'], now)
    sleep(0.5)
    return jsonify(orders)

@app.route('/api/orders/clear', methods=['GET'])
def clear_orders():
    Orders.remove_all_orders()
    status = {'status': 'ok'}
    return jsonify(status)

@app.route('/api/orders/generate', methods=['GET'])
def generate_orders():
    Orders.remove_all_orders()
    for order in id_to_order:
        Orders.create_order(id_to_order[order])
    status = {'status': 'ok'}
    return jsonify(status)

@app.route('/api/orders/remove/<int:order_id>', methods=['GET'])
def clear_order_by_id(order_id):
    order = Orders.get_order(order_id)
    if(not order):
        raise InvalidUsage('Order {} not found'.format(order_id), status_code=404)
    Orders.remove_order(order_id)
    status = {'status': 'ok'}
    return jsonify(status)

@app.route('/api/order/create', methods=['POST'])
def create_order():
    order = request.json
    Orders.create_order(order['order'])
    status = {'status': 'ok'}
    return jsonify(status)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index_orderr(path):
    return render_template('index.html')
