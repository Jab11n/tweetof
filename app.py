from flask import Flask, request, jsonify, send_from_directory, render_template

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def index():
    return render_template('home-loggedout.html')

@app.route('/users/<username>')
def user_profile(username):
    return render_template('user.html', username=username)

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True)
