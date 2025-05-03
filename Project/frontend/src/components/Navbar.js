import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import logo from '../components/images/Job portal logo.png';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className='header-logo'>
          <img 
            src={logo} 
            className='job-portal-logo m-2 mt-1' 
            alt='logo' 
            style={{width: '20px'}}
            />
          <a className="navbar-brand" href="/">
              <b>JobHub</b>
          </a>
        </div>
        {/* <Link to="/" className="logo">JobHub</Link> */}
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/jobs-list">Jobs</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        <div className="auth-buttons">
          <Link to="/login" className="btn-login">Login</Link>
          <Link to="/register" className="btn-register">Register</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
