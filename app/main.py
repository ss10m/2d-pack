from flask import Flask, request, jsonify, make_response, render_template
from bin_packing.packing import packing_algo
from order import *
from time import sleep
import psycopg2
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__, static_folder="build/static", template_folder="build")

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:pgpw@db:5432/mydb"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
db = SQLAlchemy(app)

id_to_order = {
    192161: order192161,
    192162: order192162,
    192163: order192163,
    192164: order192164,
    192165: order192165,
    192166: order192166,
    192167: order192167,
    192168: order192168,
    192171: order192171
}

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
        return '<User %r>' % self.id

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

def date_difference(then, now):
    dt = now - then
    offset = dt.seconds + (dt.days * 60*60*24)

    delta_s = int(offset % 60)
    offset /= 60
    delta_m = int(offset % 60)
    offset /= 60
    delta_h = int(offset % 24)
    offset /= 24
    delta_d = int(offset)

    if(delta_d > 365):
        years = int(delta_d / 365)
        return "{} year{} ago".format(years, "s" if years > 1 else "")
    if(delta_d > 30):
        months = int(delta_d / 30)
        return "{} month{} ago".format(months, "s" if months > 1 else "")
    if(delta_d > 0):
        return "{} day{} ago".format(delta_d, "s" if delta_d > 1 else "")
    if delta_h > 0:
        return "{} hour{} ago".format(delta_h, "s" if delta_h > 1 else "")
    if delta_m > 0:
        return "{} minute{} ago".format(delta_m, "s" if delta_m > 1 else "")
    if delta_s > 30:
        return "{} seconds ago".format(delta_s)
    else:
        return "just now"

@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    print("handle_invalid_usage", flush=True)
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@app.route('/api/getallorders')
def index_order():
    
    Orders.remove_all_orders()

    orders = Orders.get_all_orders()
    orders_json = {'orders': orders}

    print(orders_json, flush=True)


    for order in id_to_order:
        Orders.create_order(id_to_order[order])

    return jsonify(orders_json)

@app.route('/api/order/<int:order_id>', methods=['GET'])
def get_order(order_id):
    print("/api/order/<int:order_id>", flush=True)
    print("test12", flush=True)

    order = Orders.get_order(order_id)
    if(not order):
        raise InvalidUsage('Order {} not found'.format(order_id), status_code=400)

    boxes = packing_algo(order.data)
    response = jsonify(boxes)

    sleep(1)
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
    print(order['order']["boxes"], flush=True)

    status = {'status': 'ok'}
    response = jsonify(status)
    return response

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index_orderr(path):
    print("sending static files to " + path, flush=True)
    return render_template('index.html')