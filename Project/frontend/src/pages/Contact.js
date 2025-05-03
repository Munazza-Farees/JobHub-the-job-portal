import React, { useState } from 'react';
import axios from 'axios';
import "../styles/contact.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setStatusMessage('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      
      if (response.data.success) {
        setStatus('success');
        setStatusMessage(response.data.message);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setStatus('error');
        setStatusMessage(response.data.message || 'Error sending message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      setStatusMessage(error.response?.data?.message || 'Error sending message. Please try again.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-12 col-md-8 col-12 mx-auto">
          <div className="card shadow-sm p-2" style={{display: 'flex', flexWrap: 'wrap', gap: '20px', flex: '0 0 auto'}}>
            <div className="card-body">
              <h2 className="text-center mb-4">Contact Us</h2>
              
              <div className="row mb-4">
                <div className="col-md-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <i className="fas fa-map-marker-alt mb-2" style={{ fontSize: '24px' }}></i>
                      <h5>Address</h5>
                      <p>123 Job Street<br />Career City, ST 12345</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <i className="fas fa-phone mb-2" style={{ fontSize: '24px' }}></i>
                      <h5>Phone</h5>
                      <p>+1 (555) 123-4567<br />Mon-Fri 9am-6pm</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <i className="fas fa-envelope mb-2" style={{ fontSize: '24px' }}></i>
                      <h5>Email</h5>
                      <p>info@jobportal.com<br />support@jobportal.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className='card p-3 w-75' style={{margin: '0 auto', display: 'flex', justifyContent: 'center', flex: '0 0 auto'}}>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="text-center">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={status === 'sending'}
                    >
                      {status === 'sending' ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending...
                        </>
                      ) : 'Send Message'}
                    </button>
                  </div>

                  {status === 'success' && (
                    <div className="alert alert-success mt-3" role="alert">
                      {statusMessage || 'Your message has been sent successfully!'}
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="alert alert-danger mt-3" role="alert">
                      {statusMessage || 'There was an error sending your message. Please try again.'}
                    </div>
                  )}
                </form>
              </div>

              <div className="mt-5">
                <h4>FAQ</h4>
                <div className="accordion" id="faqAccordion">
                  <div className="accordion-item flex-fill">
                    <h2 className="accordion-header" id="headingOne">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                        How do I create an account?
                      </button>
                    </h2>
                    <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        Click on the "Register" button in the top right corner and fill out the registration form with your details.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2" aria-expanded="false" aria-controls="faq2">
                        How do I post a job?
                      </button>
                    </h2>
                    <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        Log in to your employer account, click on "Post a Job" button, and fill out the job details form.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 