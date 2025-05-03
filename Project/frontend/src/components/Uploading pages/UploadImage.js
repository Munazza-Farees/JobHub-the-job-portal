// frontend/src/components/UploadImage.js
import React, { useState } from 'react';
import axios from 'axios';

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token || !file) {
      setMessage('Please select a file and ensure you’re logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', name || file.name);

    try {
      const response = await axios.post('http://localhost:5000/api/images', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Image uploaded successfully!');
      console.log('Uploaded image:', response.data);
    } catch (error) {
      setMessage('Error uploading image: ' + (error.response?.data?.error || error.message));
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="container p-5">
      <h4>Upload Image</h4>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Image Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="file"
          className="form-control mb-2"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit" className="btn btn-primary">Upload</button>
      </form>
    </div>
  );
};

export default UploadImage;