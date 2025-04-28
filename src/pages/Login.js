import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const identifier = loginMethod === 'email' ? email : cardNumber;

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          loginMethod,
          identifier,
          password
        })
      });

      const data = await response.json();
      setLoading(false);

      if (data.status === 'success') {
        navigate('/user-dashboard', {
          state: {
            username: data.username,
            cardNumber: data.cardNumber
          }
        });
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      setLoading(false);
      alert('Server error');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box fade-in-left">
        {loading ? (
          <div className="spinner-container">
            <ClipLoader size={50} color="#4A90E2" />
            <p>Authenticating...</p>
          </div>
        ) : (
          <>
            <h2 className="login-title">Welcome Back</h2>
            <form onSubmit={handleLogin} className="login-form">
              <select
                className="login-select"
                value={loginMethod}
                onChange={(e) => setLoginMethod(e.target.value)}
              >
                <option value="email">Login with Email</option>
                <option value="card">Login with Card Number</option>
              </select>

              {loginMethod === 'email' ? (
                <input
                  type="email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              ) : (
                <input
                  type="text"
                  placeholder="Enter your Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              )}

              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Link to="/forget-password" className="forget-password-link">Forget Password?</Link>
              <button type="submit">Login</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
