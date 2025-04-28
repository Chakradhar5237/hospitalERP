from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from handleDatabaseConn import session, User, collection

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database setup
engine = create_engine('sqlite:///db/user_database.db')
Session = sessionmaker(bind=engine)
session = Session()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    login_method = data.get("loginMethod")
    identifier = data.get("identifier")
    password = data.get("password")

    if login_method == "email":
        user = session.query(User).filter_by(Email=identifier).first()
    elif login_method == "card":
        user = session.query(User).filter_by(CardNumber=identifier).first()
    else:
        return jsonify({"status": "failed", "message": "Invalid login method"}), 400

    if not user:
        return jsonify({"status": "failed", "message": "User not found"}), 404

    if user.Password != password:
        return jsonify({"status": "failed", "message": "Incorrect password"}), 401

    return jsonify({
        "status": "success",
        "username": user.UserName,
        "cardNumber": user.CardNumber
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True, use_reloader=False)

