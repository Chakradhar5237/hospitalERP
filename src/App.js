import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import ValidationPage from './pages/ValidatePage';
import ForgetPage from './pages/ForgetPage';
import './index.css';

function App() {
  return (
    <>
    {/*<ValidationPage />*/}
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-dashboard" element={<UserDashboard />}/>
        <Route path="/validate" element={<ValidationPage />} />
        <Route path='/forget-password' element={<ForgetPage />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
