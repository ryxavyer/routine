from flask import Flask, jsonify, request, json, url_for, session, redirect
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import backref
from authlib.integrations.flask_client import OAuth
from auth_decorator import login_required
from google.oauth2 import id_token
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///routine.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = os.getenv("APP_SECRET_KEY")
app.config['SESSION_COOKIE_NAME'] = 'google-login-session'

db = SQLAlchemy(app)

class Item(db.Model):
    id = db.Column(db.Integer, primary_key = True, autoincrement=True)
    content = db.Column(db.Text, nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))
    list_id = db.Column(db.Integer, db.ForeignKey('itemlist.id', ondelete='CASCADE'))

    def __str__(self):
        return f'{self.id} {self.content} {self.user_id}'

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True, autoincrement=True)
    email = db.Column(db.String, nullable = False)
    name = db.Column(db.String, nullable = False)
    items = db.relationship("Item", backref=backref('author', passive_deletes=True))
    lists = db.relationship("Itemlist", backref=backref('listauthor', passive_deletes=True))

    def __str__(self):
        return f'{self.id} {self.email} {self.name} {self.items}'

class Itemlist(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    items = db.relationship("Item", backref=backref('list', passive_deletes=True))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))

    def __str__(self):
        return f'{self.id} {self.name} {self.user_id}'


oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    client_kwargs={'scope': 'openid profile email'},
)

def item_serializer(item):
    return {
        'id': item.id,
        'content': item.content,
    }

def list_serializer(user_list):
    return {
        'id': user_list.id,
        'name': user_list.name,
        'items': [*map(item_serializer, user_list.items)],
    }

@app.route('/')
def home():
    email = dict(session).get('email')
    name = dict(session).get('name')
    return f'Hi {name}, you are logged in as {email}!'

@app.route('/api/authorize', methods=['POST'])
def authorize():
    token = request.json['token']
    resp = requests.get(url='https://oauth2.googleapis.com/tokeninfo?id_token='+token)
    user_info = resp.json()
    handleUser(user_info['email'], user_info['given_name'])
    session['email'] = user_info['email']
    session['name'] = user_info['given_name']
    return {'name': user_info['given_name'],
            'email': user_info['email']}

@app.route('/api/logout')
def logout():
    for key in list(session.keys()):
        session.pop(key)
    return {'200': 'Logout successful'}

@app.route('/api/undefined', methods=['GET'])
def test():
    return {'200': 'No problem'}

@app.route('/api/fetchinfo', methods=['GET'])
@login_required
def index():
    user = User.query.filter_by(email=session['email']).first()
    if user:
        return jsonify([*map(list_serializer, user.lists)])
    return {'500': 'Log in to fetch data'} #Fix me 

@app.route('/api/createlist', methods=['POST'])
@login_required
def createList():
    user = User.query.filter_by(email=session['email']).first()
    data = json.loads(request.data)
    newlist = Itemlist(name=data['name'], items=[], listauthor=user)
    db.session.add(newlist)
    db.session.commit()
    return jsonify(list_serializer(newlist))

@app.route('/api/<int:list_id>/create', methods=['POST'])
@login_required
def createItem(list_id):
    user = User.query.filter_by(email=session['email']).first()
    currList = Itemlist.query.filter_by(id=list_id).first()
    data = json.loads(request.data)
    item = Item(content=data['content'], user_id=user.id, list_id=currList.id)
    db.session.add(item)
    db.session.commit()
    return {'201': 'item created successfully'}

@app.route('/api/<int:list_id>', methods=['GET'])
@login_required
def updatedItems(list_id):
    currList = Itemlist.query.filter_by(id=list_id).first()
    return jsonify(list_serializer(currList))

@app.route('/api/delete', methods=['POST'])
@login_required
def delete():
    data = json.loads(request.data)
    item = Item.query.filter_by(id=data['id']).first()
    db.session.delete(item)
    db.session.commit()
    return {'200': 'item deleted successfully'}

@app.route('/api/deletelist', methods=['POST'])
@login_required
def deleteList():
    data = json.loads(request.data)
    listref = Itemlist.query.filter_by(id=data['id']).first()
    db.session.delete(listref)
    db.session.commit()
    return {'200': 'list deleted successfully'}

def handleUser(email, name):
    user = User.query.filter_by(email=email).first()
    if user:
        return
    new_user = User(email=email, name=name)
    starterList = Itemlist(name='General', listauthor=new_user)
    starterItem = Item(content='To-do item', author=new_user, list=starterList)
    new_user.lists.append(starterList)
    new_user.items.append(starterItem)
    db.session.add(new_user)
    db.session.commit()
    return

if __name__ == '__main__':
    app.run(debug=True)