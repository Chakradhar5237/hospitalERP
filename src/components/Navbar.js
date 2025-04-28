import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS for Navbar

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={require('../assets/logo.png')} alt="Hospital Logo" className="logo-image" />
      </div>
      <div className="links-container">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
      </div>
    </nav>
  );
}
