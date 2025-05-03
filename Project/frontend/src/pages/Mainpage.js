import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/home.css"

function Mainpage() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1 className="text-dark">Find Your Dream Job</h1>
        <p className="text-dark">Explore thousands of job opportunities from top companies.</p>
        <Link to="/jobs-list" className="btn-explore" style={{border: '2px solid rgb(0, 72, 180)'}}>Browse Jobs</Link>
      </section>

      {/* Featured Jobs Section */}
      <section className="featured-jobs">
        <h2>Featured Jobs</h2>
        <div className="job-list">
          <div className="job-card">
            {/* <img src="/icons/google-icon.png" alt="Google Logo" className="company-logo" /> */}
            <h3>Software Engineer</h3>
            <p>Google - New York</p>
            <p className="job-description">Join Google's innovative team to build scalable and efficient software solutions. Work on cutting-edge technologies and AI-driven applications that impact billions worldwide.</p>
            <Link to="/jobs/1" className="btn-apply">Apply Now</Link>
          </div>
          <div className="job-card">
            {/* <img src="/icons/amazon-icon.png" alt="Amazon Logo" className="company-logo" /> */}
            <h3>Data Analyst</h3>
            <p>Amazon - Seattle</p>
            <p className="job-description">Analyze and interpret complex data to drive business decisions at Amazon. Collaborate with diverse teams to enhance customer experiences and improve operational efficiency.</p>
            <Link to="/jobs/2" className="btn-apply">Apply Now</Link>
          </div>
          <div className="job-card">
            {/* <img src="/icons/facebook-icon.png" alt="Facebook Logo" className="company-logo" /> */}
            <h3>UI/UX Designer</h3>
            <p>Facebook - San Francisco</p>
            <p className="job-description">Design seamless user experiences for millions of users worldwide. Help shape the next generation of social media interfaces with innovative and user-friendly designs.</p>
            <Link to="/jobs/3" className="btn-apply">Apply Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Mainpage;
