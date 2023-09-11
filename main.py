from flask import Flask
from flask import render_template
from flask import request
from flask import redirect
from flask import session
from flask import jsonify

import uuid
import base64
from io import BytesIO

from data import NotesuData

app = Flask(__name__, static_folder="src")
app.secret_key = uuid.uuid4().hex

with app.app_context():
    database = NotesuData()

# database = None

#Kontrolleret nedlukning af databasen
@app.teardown_appcontext
def close_connection(exception):
    database.close_connection()

def my_render(template, **kwargs):
    login_status = get_login_status()
    print(f"Rendering template {template} for user {session.get('currentuser')} with login_status {login_status}")
    if login_status:
        return render_template(template, loggedin=login_status, user=session['currentuser'], username=database.get_user_name(session['currentuser']), **kwargs)
    else:
        return render_template(template, loggedin=login_status, user='', username="", **kwargs)



def get_login_status():
    print("currentuser" in session)
    return 'currentuser' in session

def get_user_id():
    if get_login_status():
        return session['currentuser']
    else:
        return -1


@app.route("/register")
def register():
    return my_render('register.html', success= True, complete = True)

@app.route("/login")
def login():
    return my_render('login.html', success = True)

@app.route("/logout")
def logout():
    session.pop('currentuser', None)
    return redirect('/landing')

@app.route('/register_user', methods=['POST'])
def register_user():
    pw = request.form['password']
    user = request.form['username']
    email = request.form['email']

    if register_success(user, pw, email):
        session['currentuser'] = database.get_user_id(user)
        print(f"User {user} registered successfully with ID {session['currentuser']}")
        return redirect("/home")
    else:
        print(f"Registration failed for user {user}")
        return redirect("/landing?success=False")

def login_success(user, pw):
    return database.login_success(user,pw)

def register_success(user, pw, email):
    return database.register_user(user, pw, email)

@app.route('/login_user', methods=['POST'])
def login_user():
    data = request.form
    pw = data['password']
    user = data['username']

    if login_success(user, pw):
        session['currentuser'] = database.get_user_id(user)
        print(f"User {user} logged in with ID {session['currentuser']}")
        return redirect("/home")
    else:
        print(f"Login failed for user {user}")
        return redirect("/landing?success=False")




@app.route("/savenote", methods=["POST"])
def save_note():
    data = request.json
    noteID = data.get("id")
    noteText = data.get("Contents")
    # noteDeadline = data.get("Deadline")

    database.save_notes(noteID, noteText)

    return jsonify({'message': 'Note saved successfully'})

@app.route("/createnote", methods=["POST"])
def create_note():
    data = request.json
    noteID = data.get("id")

    ownerID = get_user_id()

    database.create_note(noteID, ownerID)

    return jsonify({'message': 'Note instance created successfully'})



@app.route("/deletenote", methods=["POST"])
def delete_note():
    data = request.json
    noteID = data.get("id")

    database.delete_note(noteID)

    return jsonify({'message': 'Note deleted successfully'})



@app.route("/home")
def home():
    #return my_render("notes.html")
    if 'currentuser' in session:
        current_user_id = session['currentuser']
        return my_render("notes.html")
    else:
        # Handle the case when the user is not logged in
        # You can redirect them to a login page or handle it in another way.
        return redirect("/landing")

@app.route("/")
def redirect_til_landing():
    if get_login_status():
        get_login_status()
        print("logged in")
        return redirect("/home")
    else:
        get_login_status()
        print("logged out")
        return redirect("/landing")

@app.route("/landing")
def newUser():
    return my_render("landing.html")


if __name__ == "__main__":
    with app.app_context():
        database = NotesuData()

    app.run(debug=True)