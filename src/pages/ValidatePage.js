import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Import useLocation

export default function ValidationPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation(); // Get location state

  useEffect(() => {
    // Extract email or phone from location state
    if (location.state && location.state.emailOrPhone) {
      setEmailOrPhone(location.state.emailOrPhone);
    }
  }, [location.state]);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOtp = async () => {
    if (!emailOrPhone) {
      alert('Please enter a valid email or mobile number.');
      return;
    }

    const requestBody = emailOrPhone.includes('@')
      ? { type: 'email', Email: emailOrPhone }
      : { type: 'mobile', MobileNumber: emailOrPhone };

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/send_otp', requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setGeneratedOtp(response.data.generatedOtp); // Save OTP sent to the server
      alert('OTP sent successfully!');
    } catch (error) {
      alert('Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateOtp = async () => {
    if (!otp) {
      setOtpError('Please enter the OTP.');
      return;
    }

    if (otp !== generatedOtp) {
      setOtpError('Invalid OTP entered.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/validate_otp', {
        GeneratedOTP: generatedOtp,
        EnteredOTP: otp,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.valid) {
        alert('OTP validated successfully!');
      } else {
        alert('OTP validation failed.');
      }
    } catch (error) {
      alert('Failed to validate OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="validation-container">
      <div className="validation-card">
        <h2>OTP Validation</h2>

        <div className="input-group">
          <label>Email or Mobile Number</label>
          <input
            type="text"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder="Enter Email or Mobile Number"
            required
            disabled
          />
        </div>

        <div className="input-group">
          <label>Enter OTP</label>
          <input
            type="text"
            value={otp}
            onChange={handleOtpChange}
            placeholder="Enter OTP"
            required
          />
          {otpError && <p className="error">{otpError}</p>}
        </div>

        <div className="button-group">
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={loading}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
          <button
            type="button"
            onClick={handleValidateOtp}
            disabled={loading}
          >
            {loading ? 'Validating OTP...' : 'Validate OTP'}
          </button>
        </div>
      </div>
    </div>
  );
}
