import React from "react";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; 2025 MyJobPortal. All rights reserved.</p>
        <div className="social-links">
          <a href="#" className="social-icon">Facebook</a>
          <a href="#" className="social-icon">Twitter</a>
          <a href="#" className="social-icon">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
