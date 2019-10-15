import os

from flask import (Flask, render_template, request, abort, url_for, jsonify)
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)


class Todo(db.Model):
    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(), nullable=False)
    done = db.Column(db.Boolean, default=False, nullable=False)

    def __repr__(self):
        return f'<Todo {self.id} {self.description}>'


db.create_all()


@app.route('/')
def index():
    return render_template('index.html', todos=Todo.query.all())


@app.route('/todos/create', methods=['POST'])
def add_todo():
    try:
        todo = request.get_json()['description']
        todo = Todo(description=todo)
        db.session.add(todo)
        db.session.commit()
        return jsonify({'description': todo.description})
    except:
        db.session.rollback()
        abort(400)
    finally:
        db.session.close()
