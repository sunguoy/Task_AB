from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# /// = relative path, //// = absolute path
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.String(100))
    email = db.Column(db.String(100))
    priority  = db.Column(db.String(6))
    complete = db.Column(db.Boolean)

@app.before_first_request
def create_tables():
    db.create_all()

@app.route("/")
def home():
    todo_list = Todo.query.all()
    return render_template("base.html", todo_list=todo_list)


@app.route("/submit", methods=["POST"])
def submit():
    import json
    data = request.data
    data = json.loads(data)
    taskname = data.get("taskname")
    description = data.get("description")
    email= data.get("email")
    priority = data.get("priority")

    with open('task.txt', 'a+') as f:
        f.write(taskname)
        f.write(" ")
        f.write(description)
        f.write(" ")
        f.write(email)
        f.write(" ")
        f.write(priority)
        f.write(" \n")

    new_todo = Todo(title=taskname, description=description, email=email, priority=priority, complete=False)
    db.session.add(new_todo)
    db.session.commit()
    return redirect(url_for("home"))

@app.route("/clear", methods=["POST"])
def clear():
    with open('task.txt', 'a') as f:
        f.truncate(0)
    todo_list = Todo.query.all()
    for todo in todo_list:
        db.session.delete(todo)
    db.session.commit()
    return redirect(url_for("home"))


if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)