from flask import Flask, render_template
#app = Flask(__name__)
app = Flask(__name__, static_folder="./build/static", template_folder="./build")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index_orderr(path):
    print(path)
    return render_template('index.html')