#! usr/bin/env python

from flask import abort, Flask, g, jsonify, request, render_template, url_for
from flask.ext.bcrypt import check_password_hash
from flask.ext.login import (current_user, LoginManager, login_user,
                             logout_user, login_required)
from functools import wraps

import json
import models

DEBUG = True
PORT = 8000
HOST = '0.0.0.0'

app = Flask(__name__)
app.secret_key = 'iwnv847*345798^^#*(vs&348agxcvifj**w9'

login_manager = LoginManager()
login_manager.init_app(app)

def token_required(func):
    @wraps(func)
    def check_token():
        try:
            user = models.User.verify_auth_token(request.headers.get('x-session-token'))
            return func()
        except ValueError:
            return abort(403)
    return check_token

@login_manager.user_loader
def load_user(userid):
    try:
        return models.User.get(models.User.id == userid)
    except models.DoesNotExist:
        return None

@app.before_request
def before_request():
    """Connect to the database before each request."""
    g.db = models.DATABASE
    g.db.connect()
    g.user = current_user

@app.after_request
def after_request(response):
    """Close the database connection after each request."""
    g.db.close()
    return response

@app.route('/get_user')
@token_required
def get_user():
    try:
        user = models.User.verify_auth_token(request.headers.get('x-session-token'))
        return jsonify({ 'username': user.username })
    except ValueError:
        return jsonify({'message': 'Missing or incorrect token'}), 400

@app.route('/api/users', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    email = request.json.get('email')
    if username is None or email is None or password is None:
        abort(400)
    if models.User.select().where(models.User.username == username).first() is not None:
        abort(400)
    models.User.create_user(
        username = username,
        email = email,
        password = password)
    user = models.User.get(models.User.username == username)
    login_user(user)
    token = g.user.generate_auth_token()
    return jsonify({ 'token': token.decode('ascii') }), 200

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    try:
        user = models.User.get(models.User.username == username)
    except models.DoesNotExist:
        return jsonify({ 'message': 'User does not exist' }), 400
    else:
        if check_password_hash(user.password, password):
            login_user(user)
            token = g.user.generate_auth_token()
            return jsonify({ 'token': token.decode('ascii') }), 200
        else:
            return jsonify({ 'message': 'Incorrect password' }), 400

@app.route('/api/logout')
@token_required
def logout():
    logout_user()
    return jsonify({ 'message': 'User successfully logged out' })

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    models.initialize()
    try:
        models.User.create_user(
            username='BlaisezFaire',
            email='blaisegratton@gmail.com',
            password='asdfasdf',
            admin=True
        )
    except ValueError:
        pass
    app.run(debug=DEBUG, host=HOST, port=PORT)
