from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from handleDatabaseConn import User
import smtplib
from email.mime.text import MIMEText
import random

# Flask App Setup
app = Flask(__name__)
CORS(app)

# Database Setup
engine = create_engine('sqlite:///db/user_database.db')
Session = sessionmaker(bind=engine)
session = Session()
sender = "gannuthalachakri@gmail.com"
password = "whik onuq itiq xcvp"
otp = 0

@app.route('/send_otp', methods=['POST'])
def sendOTP():
    data = request.get_json()
    email = data.get('email')
    user = session.query(User).filter_by(Email=email).first()
    
    if user:
        # Generate a 6-digit OTP
        otp = random.randint(100000, 999999)
        # Email content
        msg = MIMEText(
            f"Hello {user.UserName},\n\n"
            f"Welcome to Hospital ERP!\n"
            f"Your OTP for password recovery is: {otp}\n\n"
            f"Please enter this OTP in the verification field.\n\n"
            f"Thank you,\n"
            f"Hospital ERP Team"
        )
        msg['Subject'] = 'OTP for Password Recovery'
        msg['From'] = sender
        msg['To'] = email
        
        # Send the email
        try:
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
                smtp_server.login(sender, password)
                smtp_server.send_message(msg)
            return jsonify({"message": "OTP sent successfully", "exists": True}), 200
        except Exception as e:
            return jsonify({"message": "Error sending OTP", "error": str(e)}), 500
    else:
        return jsonify({"message": "Email not found", "exists": False}), 404

# API to change user password
@app.route('/change_password', methods=['POST'])
def change_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('newPassword')
    user = session.query(User).filter_by(Email=email).first()
    if user:
        user.Password = new_password
        session.commit()
        return jsonify({"message": "Password updated successfully."}), 200
    else:
        return jsonify({"message": "User not found."}), 404

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001, debug=True, use_reloader=False)
