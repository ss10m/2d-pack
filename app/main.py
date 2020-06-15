from flask import Flask, request, jsonify, make_response, render_template
from bin_packing.packing import packing_algo
from order import *

app = Flask(__name__, static_folder="./build/static", template_folder="./build")

id_to_order = {192161: order192161,
               192162: order192162,
               192163: order192163,
               192164: order192164,
               192165: order192165,
               192166: order192166,
               192167: order192167}

@app.route('/api/boxes/<int:order_id>', methods=['GET'])
def get_order(order_id):

    # JSONify response

    # Mozilla provides good references for Access Control at:
    # https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    # https://developer.mozilla.org/en-US/docs/Web/HTTP/Server-Side_Access_Control

    print(order_id in id_to_order)

    if order_id not in id_to_order: 
        response = make_response(jsonify({'error': 'invalid order id'}))
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:8000'
        return response;

    boxes = packing_algo(id_to_order[order_id])
    response = make_response(jsonify(boxes))

    # Add Access-Control-Allow-Origin header to allow cross-site request
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:8000'
    #response.headers['Access-Control-Allow-Origin'] = 'http://172.24.0.3:3000'
    
    
    return response

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index_orderr(path):
    print(path)
    return render_template('index.html')


print("running")