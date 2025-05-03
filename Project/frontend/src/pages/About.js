import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const About = () => {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-12 col-md-8 col-12 mx-auto">
          <div className="card shadow-sm p-2">
            <div className="card-body">
              <h2 className="text-center mb-4">About Our Job Portal</h2>
              
              <div className="mb-4">
                <h4>Our Mission</h4>
                <p>
                  We are dedicated to connecting talented professionals with outstanding employers. Our mission is to make 
                  the job search process more efficient, transparent, and successful for both job seekers and employers.
                </p>
              </div>

              <div className="mb-4">
                <h4>What We Offer</h4>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5>For Job Seekers</h5>
                        <ul className="list-unstyled">
                          <li>✓ Access to thousands of job listings</li>
                          <li>✓ Professional profile creation</li>
                          <li>✓ Easy application process</li>
                          <li>✓ Job alerts and recommendations</li>
                          <li>✓ Career resources and guides</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5>For Employers</h5>
                        <ul className="list-unstyled">
                          <li>✓ Access to qualified candidates</li>
                          <li>✓ Easy job posting process</li>
                          <li>✓ Applicant tracking system</li>
                          <li>✓ Company branding opportunities</li>
                          <li>✓ Analytics and reporting</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4>Our Values</h4>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="card text-center h-100">
                      <div className="card-body">
                        <h5>Innovation</h5>
                        <p>Continuously improving our platform with the latest technology</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card text-center h-100">
                      <div className="card-body">
                        <h5>Integrity</h5>
                        <p>Maintaining honest and transparent relationships</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card text-center h-100">
                      <div className="card-body">
                        <h5>Impact</h5>
                        <p>Making a difference in people's careers and businesses</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4>Why Choose Us</h4>
                <p>
                  Our platform combines cutting-edge technology with a user-friendly interface to create 
                  the most effective job search and recruitment experience. We understand the challenges 
                  of today's job market and are committed to providing solutions that work for everyone.
                </p>
              </div>

              <div className="text-center mt-5">
                <h4>Ready to Get Started?</h4>
                <p className="mb-4">Join thousands of successful job seekers and employers who trust our platform.</p>
                <button className="btn btn-primary mx-2">Find Jobs</button>
                <button className="btn btn-outline-primary mx-2">Post a Job</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 