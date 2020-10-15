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

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:pgpw@db:5432/mydb"
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
    print("handle_invalid_usage", flush=True)
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

@app.route('/api/order/<id>', methods=['GET'])
def get_order(id):
    print("/api/order/<id>", flush=True)

    order_id = parseInt(id)
    if(not order_id):
        raise InvalidUsage('{} is not a valid order number'.format(id), status_code=400)
    
    order = Orders.get_order(order_id)
    if(not order):
        raise InvalidUsage('Order {} not found'.format(id), status_code=400)

    boxes = packing_algo(order.data)
    boxes["original"] = order.data["boxes"]
    response = jsonify(boxes)
    return response

@app.route('/api/order/<int:order_id>/labels', methods=['POST'])
def print_labels(order_id):
    print("/api/order/<int:order_id>/labels", flush=True)
    boxes = request.json
    labels = {'labels': len(boxes['boxes'])}
    response = jsonify(labels)
    sleep(1)
    
    return response

@app.route('/api/orders', methods=['GET'])
def get_orders():
    print("/api/orders", flush=True)
    #clear_orders()
    orders = {'recent_orders': Orders.get_recent_orders()}

    now = datetime.utcnow()
    for order in orders['recent_orders']:
        order['created_at'] = date_difference(order['created_at'], now)

    response = jsonify(orders)
    sleep(1)
    return response

@app.route('/api/order/create', methods=['POST'])
def create_order():
    print("/api/order/create", flush=True)
    
    order = request.json
    Orders.create_order(order['order'])

    status = {'status': 'ok'}
    response = jsonify(status)
    return response

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index_orderr(path):
    print("sending static files to " + path, flush=True)
    return render_template('index.html')

def clear_orders():
    Orders.remove_all_orders()
    orders = Orders.get_all_orders()
    orders_json = {'orders': orders}
    for order in id_to_order:
        Orders.create_order(id_to_order[order])