import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const NewsSection = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [news, setNews] = useState([]);
  const [displayedNews, setDisplayedNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchNews();
  }, [user, navigate]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("http://localhost:5000/api/news", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNews(data);
      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setDisplayedNews(data[randomIndex]);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to load news.");
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (news.length > 0) {
      const randomIndex = Math.floor(Math.random() * news.length);
      setDisplayedNews(news[randomIndex]);
    }
  };

  return (
    <div className="container-fluid min-vh-100 py-5 d-flex justify-content-center align-items-center" style={{ background: "#f5f6fa" }}>
      <div className="card shadow-sm p-5 w-100" style={{ maxWidth: "900px" }}>
        <h2 className="card-title text-center fw-bold mb-4">News</h2>

        {/* Display Random News Card */}
        {loading ? (
          <div className="text-center">Loading news...</div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : displayedNews ? (
          <div className="row justify-content-center">
            <div className="col-12 mb-4">
              <div className="card shadow border-0 p-3">
                <h5>{displayedNews.title}</h5>
                <p>{displayedNews.description}</p>
                <p><strong>Company:</strong> {displayedNews.company}</p>
                <p><strong>Image ID:</strong> {displayedNews.imageId}</p>
                <p>
                  <strong>Posted By:</strong>{" "}
                  {displayedNews.postedBy && displayedNews.postedBy.name
                    ? `${displayedNews.postedBy.name} (${displayedNews.postedBy.role || "Unknown Role"})`
                    : "Unknown Author"}
                </p>
                <p>
                  <strong>Posted On:</strong>{" "}
                  {displayedNews.postedAt
                    ? new Date(displayedNews.postedAt).toLocaleDateString()
                    : "Unknown Date"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted">No news found.</div>
        )}

        {/* Buttons */}
        <div className="d-flex gap-2 justify-content-center mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/upload-news")}
          >
            Post News
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={handleRefresh}
            disabled={loading || news.length === 0}
          >
            Refresh
          </button>
          <button
            className="btn btn-outline-success"
            onClick={() => navigate("/news")}
          >
            More News
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;