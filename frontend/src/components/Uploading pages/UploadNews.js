import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UploadNews = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [news, setNews] = useState({
    title: '',
    description: '',
    company: '',
    imageId: '',
  });
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    const fetchImages = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please log in to upload news.');
        navigate('/login');
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/images', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setImages(response.data);
        if (response.data.length > 0) {
          setNews((prev) => ({ ...prev, imageId: response.data[0]._id }));
        } else {
          setMessage('No images available. You can upload a new image below.');
        }
      } catch (error) {
        setMessage('Error fetching images: ' + (error.response?.data?.error || error.message));
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNews((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async () => {
    if (!file || !name) {
      setMessage('Please provide an image and a name for the image.');
      return null;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', name);

    try {
      const response = await axios.post('http://localhost:5000/api/images', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Image uploaded successfully!');
      setImages((prev) => [...prev, response.data]);
      setFile(null);
      setName('');
      return response.data._id; // Return the new image ID
    } catch (error) {
      setMessage('Error uploading image: ' + (error.response?.data?.error || error.message));
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in to upload news.');
      navigate('/login');
      return;
    }
    if (!news.title || !news.description || !news.company) {
      setMessage('Title, description, and company are required.');
      return;
    }

    setLoading(true);
    setMessage('');

    let finalImageId = news.imageId;

    // If a new image is selected, upload it first
    if (file) {
      const uploadedImageId = await handleImageUpload();
      if (!uploadedImageId) {
        setLoading(false);
        return;
      }
      finalImageId = uploadedImageId;
    }

    if (!finalImageId) {
      setMessage('Please select an existing image or upload a new one.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/news',
        { ...news, imageId: finalImageId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage('News uploaded successfully!');
      setNews({ title: '', description: '', company: '', imageId: images[0]?._id || '' });
      navigate('/homepage');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      setMessage(`Error uploading news: ${errorMsg}`);
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 py-5 d-flex justify-content-center align-items-center" style={{ background: '#f5f6fa' }}>
      <div className="card shadow-sm p-5 w-100" style={{ maxWidth: '900px' }}>
        <h2 className="card-title text-center fw-bold mb-4">Upload Company News</h2>
        {message && (
          <div
            className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} text-center mb-4`}
          >
            {message}
          </div>
        )}
        {loading && <p className="text-center">Loading...</p>}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="imageUpload" className="form-label fw-medium">
                Upload New Image (Optional)
              </label>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Image Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
              <input
                type="file"
                id="imageUpload"
                className="form-control mb-2"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
              />
            </div>
            <div className="col-12">
              <label htmlFor="imageId" className="form-label fw-medium">
                Select Existing Image
              </label>
              <select
                id="imageId"
                name="imageId"
                value={news.imageId}
                onChange={handleChange}
                className="form-select"
                disabled={loading || images.length === 0}
              >
                {images.length > 0 ? (
                  images.map((image) => (
                    <option key={image._id} value={image._id}>
                      {image.name} ({image.path})
                    </option>
                  ))
                ) : (
                  <option value="">No images available</option>
                )}
              </select>
            </div>
            <div className="col-12">
              <label htmlFor="title" className="form-label fw-medium">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={news.title}
                onChange={handleChange}
                className="form-control"
                required
                disabled={loading}
              />
            </div>
            <div className="col-12">
              <label htmlFor="description" className="form-label fw-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={news.description}
                onChange={handleChange}
                className="form-control"
                rows="3"
                required
                disabled={loading}
              />
            </div>
            <div className="col-12">
              <label htmlFor="company" className="form-label fw-medium">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={news.company}
                onChange={handleChange}
                className="form-control"
                required
                disabled={loading}
              />
            </div>
            <div className="col-12 d-flex d-grid gap-2 justify-content-center align-items-center">
              <button type="submit" className="btn btn-primary w-100 py-2 mt-3" disabled={loading}>
                Upload News
              </button>
              <button
                type="button"
                className="btn btn-outline-primary w-100 py-2 mt-3"
                onClick={() => navigate('/homepage')}
                disabled={loading}
              >
                Go Back
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadNews;