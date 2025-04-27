import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';
import '../styles/modal.css';
import '../styles/auth.css';

const Register = () => {
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'jobseeker', // Default role
  });
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Basic client-side validation
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('All fields are required.');
      return;
    }

    try {
      console.log('Registering with:', formData);
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      console.log('Registration response:', response.data);

      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      setUser({ userId: response.data.userId, name: formData.name, role: formData.role });
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/setupProfile');
      }, 1000);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('Registration error:', err.response?.data || err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h1>Register</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            className="mb-2"
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className="mb-2"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="mb-2"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="mb-2">
            <label className="form-label">Role</label>
            <div>
              <label className="me-3">
                <input
                  type="radio"
                  name="role"
                  value="jobseeker"
                  checked={formData.role === 'jobseeker'}
                  onChange={handleChange}
                  required
                />{' '}
                Job Seeker
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="jobprovider"
                  checked={formData.role === 'jobprovider'}
                  onChange={handleChange}
                  required
                />{' '}
                Job Provider
              </label>
            </div>
          </div>
          <button className="m-3" type="submit">
            Register
          </button>
        </form>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
        {showModal && <Modal message="Registration successful!" onClose={() => setShowModal(false)} />}
      </div>
    </div>
  );
};

export default Register;