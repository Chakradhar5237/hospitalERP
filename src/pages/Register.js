import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import './Register.css';

export default function Register() {
  const [formData, setFormData] = useState({
    UserName: '',
    MobileNumber: '',
    Email: '',
    Status: '',
    DateOfBirth: '',
    Password: '',
    ConfirmPassword: '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const validateMobileNumber = (mobileNumber) => {
    const regex = /^[0-9]{10}$/; // Validates a 10-digit mobile number
    return regex.test(mobileNumber);
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Validates email format
    return regex.test(email);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(formData.Email)) {
      setEmailError('Please enter a valid email address.');
      return;
    } else {
      setEmailError('');
    }

    // Validate mobile number
    if (!validateMobileNumber(formData.MobileNumber)) {
      setPhoneError('Please enter a valid mobile number (10 digits).');
      return;
    } else {
      setPhoneError('');
    }

    // Validate password and confirm password
    if (formData.Password !== formData.ConfirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    if (!validatePassword(formData.Password)) {
      setPasswordError('Password must be at least 8 characters, include one uppercase letter, and one number.');
      return;
    }

    setPasswordError('');

    // Convert profile photo to base64 if it's provided
    let profilePhotoBase64 = null;
    if (profilePhoto) {
      const reader = new FileReader();
      reader.onloadend = () => {
        profilePhotoBase64 = reader.result.split(',')[1]; // Extract base64 string (without data:image/* part)
      };
      reader.readAsDataURL(profilePhoto);
    }

    // Wait for the profile photo to be converted to base64 (if necessary)
    if (profilePhoto) {
      const profilePhotoBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result.split(',')[1]); // Extract base64 string (without data:image/* part)
        };
        reader.readAsDataURL(profilePhoto);
      });

      const user = {
        ...formData,
        ProfilePhoto: profilePhotoBase64,
      };

      try {
        setLoading(true);
        await axios.post('http://localhost:5000/register', user, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        alert('Registration successful!');
      } catch (error) {
        alert('Registration failed.');
      } finally {
        setLoading(false);
      }
    }
  };
  const navigate = useNavigate();
  const handleValidateEmail = () => {
    if (validateEmail(formData.Email)) {
      navigate('/validate', { state: { emailOrPhone: formData.Email } });
    } else {
      setEmailError('Invalid Email');
    }
  };

  const handleValidatePhone = () => {
    if (validateMobileNumber(formData.MobileNumber)) {
      navigate('/validate', { state: { emailOrPhone: formData.MobileNumber } });
    } else {
      setPhoneError('Invalid Phone number');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Patient Registration</h2>

        <div className="profile-photo-wrapper">
          <label htmlFor="profilePhotoInput" className="profile-photo">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" />
            ) : (
              <span>Upload Photo</span>
            )}
            <div className="hover-overlay">Change Photo</div>
            <input
              id="profilePhotoInput"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              hidden
            />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="UserName"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <div className="input-group">
            <input
              type="tel"
              name="MobileNumber"
              placeholder="Mobile Number"
              onChange={handleChange}
              required
            />
            <button type="button" className="validate-btn" onClick={handleValidatePhone}>
              Validate Phone
            </button>
          </div>
          {phoneError && <p className="error">{phoneError}</p>}

          <div className="input-group">
            <input
              type="email"
              name="Email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <button type="button" className="validate-btn" onClick={handleValidateEmail}>
              Validate Email
            </button>
          </div>
          {emailError && <p className="error">{emailError}</p>}

          <input
            type="text"
            name="Status"
            placeholder="Status (e.g. Active)"
            onChange={handleChange}
            required
          />
          <label>Date of Birth</label>
          <input type="date" name="DateOfBirth" onChange={handleChange} required />

          <input
            type="password"
            name="Password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="ConfirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />

          {passwordError && <p className="error">{passwordError}</p>}

          <button type="submit" disabled={loading} className="register-btn">
            {loading ? (
              <>
                <ClipLoader size={20} color="#ffffff" />
                <span style={{ marginLeft: '10px' }}>Registering...</span>
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
