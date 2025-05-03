import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "jobSeeker") {
      navigate("/login");
      return;
    }
    fetchApplications();
  }, [user, navigate]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get("http://localhost:5000/api/applications/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setApplications(data);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications.");
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
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
        <h2 className="mb-4 text-center">My Applications</h2>
        {loading ? (
          <div className="text-center">Loading applications...</div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : applications.length > 0 ? (
          <div className="row justify-content-center">
            {applications.map((app) => (
              <div className="col-12 col-md-6 mb-4" key={app._id}>
                <div className="card shadow border-0 p-3">
                  <h5>{app.jobId.jobTitle}</h5>
                  <p><strong>Company:</strong> {app.jobId.companyName}</p>
                  <p><strong>Status:</strong> {app.status}</p>
                  <p><strong>Applied On:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted">No applications found.</div>
        )}
      </div>
    </div>
  );
}