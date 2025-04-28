import smtplib
from email.mime.text import MIMEText
from flask import Flask, request, jsonify
from flask_cors import CORS

# Helper to login sender email and send email
def loginSender(sender, password, msg):
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
            smtp_server.login(sender, password)
            smtp_server.send_message(msg)
        return True
    except Exception as e:
        #print(f"❌ Failed to send email: {e}")
        return False


@app.route('/validate', methods=['POST'])
def validate_otp():
    sender = 'gannuthalachakri@gmail.com'
    password = 'whik onuq itiq xcvp'
    data = request.get_json()  # Corrected method
    RequestedValidation = data.get('RequestedValidation')
    if RequestedValidation == 'Email':
        email = data.get('Email')
        # Generate a 6-digit OTP
        otp = str(random.randint(100000, 999999))
        # Create the email message
        msg = MIMEText(f"Your OTP for activating account is: {otp}\n\nDo not share this with anyone.")
        msg['Subject'] = 'Confidential: Do Not Share Your OTP'
        msg['From'] = sender
        msg['To'] = email
        # Send the email
        sent = loginSender(sender, password, msg)
        if sent:
            return jsonify({"message": "OTP sent successfully!", "otp": otp}), 200
        else:
            return jsonify({"error": "Failed to send OTP email."}), 500

    return jsonify({"error": "Invalid validation request."}), 400
