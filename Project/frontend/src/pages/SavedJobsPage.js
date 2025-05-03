import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SavedJobsPage() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "jobSeeker") {
      navigate("/login");
      return;
    }
    fetchSavedJobs();
  }, [user, navigate]);

  const fetchSavedJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get("http://localhost:5000/api/saved-jobs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSavedJobs(data);
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
      setError("Failed to load saved jobs.");
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5000/api/saved-jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSavedJobs(savedJobs.filter((job) => job.jobId._id !== jobId));
    } catch (err) {
      console.error("Error removing saved job:", err);
      alert("Failed to remove saved job.");
    }
  };

  return (
    <div className="container-fluid py-5" style={{ background: "#f5f6fa" }}>
      <header style={{ height: "100px" }}>
        <div className="container-fluid" style={{ fontFamily: "Arial" }}>
          <nav
            className="navbar navbar-expand-lg navbar-light p-3"
            style={{ backgroundColor: "#37ABC8" }}
          >
            <a className="navbar-brand fw-bold text-white" href="#">
              JobHub
            </a>
            <div className="d-flex ms-auto gap-2">
              <button
                className="btn text-black me-2"
                onClick={() => navigate("/jobs-list")}
              >
                Back to Jobs
              </button>
              <button
                className="btn text-black"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Log out
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mt-4">
        <h2 className="mb-4 text-center">Saved Jobs</h2>
        {loading ? (
          <div className="text-center">Loading saved jobs...</div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : savedJobs.length > 0 ? (
          <div className="row justify-content-center">
            {savedJobs.map((savedJob) => (
              <div className="col-12 col-md-6 mb-4" key={savedJob._id}>
                <div className="card shadow border-0 p-3">
                  <h5>{savedJob.jobId.jobTitle}</h5>
                  <p><strong>Company:</strong> {savedJob.jobId.companyName}</p>
                  <p><strong>Saved On:</strong> {new Date(savedJob.savedAt).toLocaleDateString()}</p>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemove(savedJob.jobId._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted">No saved jobs found.</div>
        )}
      </div>
    </div>
  );
}