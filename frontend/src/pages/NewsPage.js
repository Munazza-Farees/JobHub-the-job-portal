import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfilePicture from '../components/images/Profile picture.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const NewsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [expanded, setExpanded] = useState({}); // Track which cards are expanded

  useEffect(() => {
    const fetchNews = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      setLoading(true);
      setErrorMessage(null);
      try {
        const response = await axios.get('http://localhost:5000/api/news', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
        setErrorMessage('Failed to load news.');
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [navigate]);

  // Handle scrolling to a specific news article based on URL hash
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#news-', '');
      const element = document.getElementById(`news-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setExpanded((prev) => ({ ...prev, [id]: true })); // Auto-expand the referenced article
      }
    }
  }, [location, news]);

  // Toggle expansion of a news card
  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Truncate description for collapsed state
  const truncateDescription = (description, maxLength = 100) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  return (
    <div className="container-fluid min-vh-100 py-5" style={{ background: '#f5f6fa', fontFamily: 'Arial' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <h2 className="text-center fw-bold mb-4">Company News</h2>
          {loading ? (
            <p className="text-center">Loading news...</p>
          ) : errorMessage ? (
            <p className="text-danger text-center">{errorMessage}</p>
          ) : news.length > 0 ? (
            news.map((item) => (
              <div
                key={item._id}
                id={`news-${item._id}`}
                className="card mb-3 shadow-sm"
              >
                <div className="card-body d-flex align-items-start">
                  <div className="company-logos me-3">
                    <img
                      src={item.imageId?.path ? `http://localhost:5000${item.imageId.path}` : ProfilePicture}
                      alt={item.company || 'Company'}
                      style={{ width: 100, height: 70, borderRadius: '10px', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.src = ProfilePicture;
                      }}
                    />
                  </div>
                  <div className="w-100">
                    <h5 className="card-title">{item.title || 'Untitled'}</h5>
                    <p className="text-muted mb-2">{item.company}</p>
                    <p>
                      {expanded[item._id]
                        ? item.description || 'No description available'
                        : truncateDescription(item.description || 'No description available')}
                    </p>
                    <button
                      className="btn btn-link p-0"
                      onClick={() => toggleExpand(item._id)}
                      style={{ textDecoration: 'none' }}
                    >
                      {expanded[item._id] ? 'Show Less' : 'Read More'} ▼
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No news available</p>
          )}
          <div className="d-flex text-center mt-4 gap-2 justify-content-center">
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate('/upload-news')}
              disabled={loading}
            >
              Post News
            </button>
            <button className="btn btn-outline-warning" onClick={() => navigate('/homepage')}>
              Go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;