import datetime

from flask.ext.bcrypt import generate_password_hash
from flask.ext.login import UserMixin
from itsdangerous import (TimedJSONWebSignatureSerializer 
                          as Serializer, BadSignature, SignatureExpired)
from peewee import *

DATABASE = SqliteDatabase('which.db', threadlocals=True)

class BaseModel(Model):
    class Meta:
        database = DATABASE

class User(UserMixin, BaseModel):
    username = CharField(unique=True)
    email = CharField(unique=True)
    password = CharField(max_length=100)
    join_date = DateTimeField(default=datetime.datetime.now)
    is_admin = BooleanField(default=False)

    def generate_auth_token(self, expiration = 6000):
        s = Serializer('*lksdf##ba29sGHdI74(*^(;', expires_in = expiration)
        return s.dumps({ 'id' : self.id })

    def get_user_photos(self):
        return Photo.select().where(Photo.user == self)


    @staticmethod
    def verify_auth_token(token):
        s = Serializer('*lksdf##ba29sGHdI74(*^(;')
        try:
            data = s.loads(token)
        except TypeError:
            raise ValueError('Token missing')
        except SignatureExpired:
            raise ValueError('Token expired')
        except BadSignature:
            raise ValueError('Token not valid')
        try:
            user = User.get(User.id == data['id'])
            return user
        except User.DoesNotExist:
            raise ValueError('Token not valid')

    @classmethod
    def create_user(cls, username, email, password, admin=False):
        try:
            cls.create(
                username=username,
                email=email, 
                password=generate_password_hash(password),
                is_admin=admin)
        except IntegrityError:
            raise ValueError("User already exists")

class Photo(BaseModel):
    user = ForeignKeyField(
        rel_model = User,
        related_name = 'photos'
    )
    base64_string = TextField()
    post_date = DateTimeField(default=datetime.datetime.now)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'user': self.user.id,
            'base64_string': self.base64_string,
            'post_date': self.post_date
        }

def initialize():
    DATABASE.connect()
    DATABASE.create_tables([User, Photo], safe=True)
    DATABASE.close()
