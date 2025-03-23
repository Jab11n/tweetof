from flask import Flask, request, jsonify, send_from_directory, render_template
import requests
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/users/<username>')
def user_profile(username):
    return render_template('user.html', username=username)

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    try:
        resp = requests.post(
            "https://api.wasteof.money/session",
            json={"username": username, "password": password},
            headers={"Content-Type": "application/json"}
        )
        return jsonify(resp.json()), resp.status_code
    except requests.RequestException as e:
        return jsonify({"error": "Failed to connect to wasteof api!", "details": str(e)}), 500

@app.route('/api/users/<username>', methods=['GET'])
def get_user(username):
    try:
        resp = requests.get(f"https://api.wasteof.money/users/{username}")
        return jsonify(resp.json()), resp.status_code
    except requests.RequestException as e:
        return jsonify({"error": "Failed to connect to wasteof api!", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
