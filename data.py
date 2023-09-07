from flask import g
import sqlite3

class NotesuData():

    def __init__(self):
        self.DATABASE = 'data.db'

        self._create_db_tables()


    def _get_db(self):
        db = g.get('_database', None)
        if db is None:
            db = g._databdase = sqlite3.connect(self.DATABASE)
        return db

    def close_connection(self):
        db = getattr(g, '_database', None)
        if db is not None:
            db.close()



    def register_new_value(self, value, id):
        db = self._get_db()
        c = db.cursor()
        c.execute("""INSERT INTO tracking (value, trackid) VALUES (?, ?);""",(value, id))
        db.commit()

    def register_new_note(self, id):
        db = self._get_db()
        c = db.cursor()
        c.execute("""INSERT INTO Notes (content, deadline, ownerID) VALUES (?, ?, ?)""", (None, None, id))
        db.commit()

    def getNotesForUser(self, userID):
        c = self._get_db().cursor()
        graphs = []
        c.execute("""SELECT id, name FROM Notes WHERE ownerID = ?""", [userID])
        for graph in c:
            graphs.append(graph)
        return graphs

    def get_value_count(self, userid):
        c = self._get_db().cursor()
        c.execute("SELECT count(rowid) FROM tracking WHERE trackid == ?;", [userid])
        n = c.fetchone()
        return n[0]

    def get_values(self, trackid):
        c = self._get_db().cursor()
        values = []
        c.execute("SELECT value FROM tracking WHERE trackid == ?;", [trackid])
        for item in c:
            values.append(int(item[0]))

        return values

    def save_notes(self, noteID, noteText, noteDeadline):
        c = self._get_db().cursor()
        c.excecute("UPDATE Notes SET content = ? deadline = ? WHERE id = ?;", (noteText, notesDeadline, noteID))


    def clear_values(self, trackid):
        c = self._get_db().cursor()
        values = []
        c.execute("DELETE FROM tracking WHERE trackid = ?;", [trackid])
        

        return values


    def get_user_id(self, s):
        c = self._get_db().cursor()
        c.execute("SELECT id FROM UserProfiles WHERE username = ?", [s])
        r = c.fetchone()
        #If the user doesn't exist, the result will be None
        if r is not None:
            return r[0]
        else:
            return None
    
    def get_user_name(self, id):
        c = self._get_db().cursor()
        c.execute("SELECT username FROM UserProfiles WHERE id = ?", [id])
        r = c.fetchone()

        if r is not None:
            return r[0]
        else:
            return None

    def register_user(self, user, pw, email):
        db = self._get_db()
        c = db.cursor()
        c.execute("SELECT * from UserProfiles WHERE username = ? OR email = ?", (user,email))
        r = c.fetchone()
        res = False
        if r is not None:
            #The username or email is already in use
            res = False
        else:
            c.execute("INSERT INTO UserProfiles (username, password, email) VALUES (?,?,?)", (user,pw,email))
            db.commit()
            res = True
        return res

    def get_user_list(self):
        l = []
        c = self._get_db().cursor()
        c.execute('SELECT * FROM UserProfiles;')
        for u in c:
            l.append("Name: {}, email: {}, pw: {}".format(u[1],u[2],u[3]))
        return l

    def login_success(self, user, pw):
        c = self._get_db().cursor()
        c.execute("SELECT password FROM UserProfiles WHERE username = ?", (user,))
        r = c.fetchone()
        if r is not None:
            db_pw = r[0]
        else:
            return False
        return db_pw == pw


    def _create_db_tables(self):
        db = self._get_db()

        c = db.cursor()
        try:
            c.execute("""CREATE TABLE UserProfiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                email TEXT,
                password TEXT);""")
        except Exception as e:
            print(e)

        try:
            c.execute("""CREATE TABLE Notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT,
                deadline DATE,
                ownerID INTEGER);""")
        except Exception as e:
            print(e)

        db.commit()
        return 'Database tables created'
