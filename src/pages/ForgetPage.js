import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgetPage.css';

const ForgetPage = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      const response = await fetch('http://localhost:8001/send_otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      setMessage(data.status);
      console.log(data.exists)
      if (!data.exists) {
        // Redirect to registration if email is not found
        navigate('/register');
      } else if (data.exists) {
        setOtpSent(true);
      }
    } catch (error) {
      setMessage('Error sending OTP');
      console.error('Error:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch('http://localhost:8001/change_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, otp })
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error updating password');
      console.error('Error:', error);
    }
  };

  return (
    <div className="forget-page">
      <h2>Forgot Password</h2>

      <div className="email-otp-row">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button onClick={handleSendOTP} className="otp-button">Send OTP</button>
      </div>

      {otpSent && (
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          value={otp}
          onChange={e => setOtp(e.target.value)}
        />
      )}

      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
      />
      <button onClick={handleUpdate}>Update Password</button>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ForgetPage;
