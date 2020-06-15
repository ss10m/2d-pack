from flask import Flask, request, jsonify, make_response, render_template
from bin_packing.packing import packing_algo
from order import *
from time import sleep

app = Flask(__name__, static_folder="./build/static", template_folder="./build")

id_to_order = {192161: order192161,
               192162: order192162,
               192163: order192163,
               192164: order192164,
               192165: order192165,
               192166: order192166,
               192167: order192167}

@app.route('/api/order/<int:order_id>', methods=['GET'])
def get_order(order_id):
    if order_id not in id_to_order: 
        response = make_response(jsonify({'error': 'invalid order id'}))
        return response;

    boxes = packing_algo(id_to_order[order_id])
    response = make_response(jsonify(boxes))
    sleep(1)

    return response

@app.route('/api/order/<int:order_id>/labels', methods=['POST'])
def print_labels(order_id):
    boxes = request.get_json(force=True)
    response = {'labels': len(boxes['boxes'])}
    response = make_response(jsonify(response))
    sleep(1)

    return response

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index_orderr(path):
    return render_template('index.html')