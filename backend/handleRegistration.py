import base64
from io import BytesIO
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import random
from handleDatabaseConn import session, User, collection
import smtplib
from email.mime.text import MIMEText

#app_password = "whik onuq itiq xcvp"

app = Flask(__name__)
CORS(app)
def generate_unique_card_number():
    while True:
        number = str(random.randint(1000000, 9999999))  # 7-digit number
        exists = session.query(User).filter_by(CardNumber=number).first()
        if not exists:
            return number

@app.route('/register', methods=['POST'])
def register_user():
    sender = 'gannuthalachakri@gmail.com'
    password = 'whik onuq itiq xcvp'
    try:
        # Access form fields
        data = request.get_json()
        print(data)
        # Extract values from the JSON payload
        card_number = generate_unique_card_number()
        user_name = data.get('UserName')
        mobile_number = data.get('MobileNumber')
        email = data.get('Email')
        status = data.get('Status')
        dob = data.get('DateOfBirth')
        profile_image_base64 = data.get('ProfilePhoto')  # Expecting base64 encoded image data
        password_to_store = data.get('ConfirmPassword')

        # Convert date string to date object
        dob_obj = datetime.strptime(dob, '%Y-%m-%d').date()

        # Step 1: Add user to SQLite
        new_user = User(
            CardNumber=card_number,
            UserName=user_name,
            MobileNumber=mobile_number,
            Email=email,
            Status=status,
            DateOfBirth=dob_obj,
            ProfileImageBase64=profile_image_base64,
            Password = password_to_store
        )
        session.add(new_user)
        session.commit()
        # Step 2: Create MongoDB medical record structure
        collection.update_one(
            {"CardNumber": card_number},
            {
                "$setOnInsert": {
                    "CardNumber": card_number,
                    "MedicalHistory": [],
                    "Category": [],
                    "Reports": {}
                }
            },
            upsert=True
        )
        msg = MIMEText(
            f"Hello {user_name},\n\n"
            f"Welcome to Hospital ERP!\n"
            f"Your unique card number is: {card_number}.\n\n"
            f"Please keep this number confidential and do not share it with anyone.\n\n"
            f"Thank you,\n"
            f"Hospital ERP Team"
        )
        msg['Subject'] = 'Confidential: Do Not Share Your Card Number'
        msg['From'] = sender
        msg['To'] = email
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
            smtp_server.login(sender, password)
            smtp_server.send_message(msg)
            # Here I want to return a error pages and successfull pages
        return jsonify({"message": "User registered successfully!"}), 201


    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, threaded=False, use_reloader=False)
