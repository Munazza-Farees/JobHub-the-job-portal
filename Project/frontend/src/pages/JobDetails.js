import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import companyLogo from "../components/images/company-logo.png";
import axios from "axios";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/jobs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, 
        });
        if (data.imageId && typeof data.imageId === 'object') {
          data.logoPath = data.imageId.path;
        }
        setJob(data);
      } catch (err) {
        console.error("Failed to fetch job details:", err);
        setError("Failed to load job details. Please try again later.");
      }
    };
    fetchJob();
  }, [id]);

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  if (!job) {
    return <div className="text-center mt-5">Loading job details...</div>;
  }

  return (
    <div className="min-vh-100" style={{ background: "#f5f6fa" }}>
      <main className="container py-5">
        <div
          className="card mx-auto shadow-lg p-5 bg-white"
          style={{
            borderRadius: "20px",
            maxWidth: "900px",
          }}
        >
          <div className="d-flex align-items-center gap-3 mb-4">
            <img
              src={job.imageId && job.imageId.path
                 ? `http://localhost:5000/${job.imageId.path}` : companyLogo}
              alt="Company Logo"
              style={{ width: "70px", height: "50px", objectFit: "contain" }}
              onError={(e) => (e.target.src = companyLogo)} 
            />
            <div>
              <h3 className="fw-bold mb-1 text-primary">{job.jobTitle}</h3>
              <p className="text-muted mb-0">{job.companyName}</p>
            </div>
          </div>

          <hr />

          <div className="mb-4">
            <h5 className="fw-semibold mb-3">Job Overview</h5>
            <div className="row">
              <div className="col-sm-6">
                <p>
                  <strong>Job Type:</strong> {job.jobType || "Full-time"} {/* Default if not present */}
                </p>
                <p>
                  <strong>Experience:</strong> {job.experience || "Not specified"} {/* Add if in model */}
                </p>
                <p>
                  <strong>Vacancies:</strong> {job.vacancy || "Not specified"} {/* Add if in model */}
                </p>
                <p>
                  <strong>Salary:</strong> {job.salary || "Not disclosed"} {/* Add if in model */}
                </p>
              </div>
              <div className="col-sm-6">
                <p>
                  <strong>Region:</strong> {job.region || "N/A"} {/* Add if in model */}
                </p>
                <p>
                  <strong>Address:</strong> {job.companyAddress}
                </p>
                <p>
                  <strong>Requirements:</strong> {job.skills}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="fw-semibold mb-3">HR Contact</h5>
            <p>
              <strong>Name:</strong> {job.hrName}
            </p>
            <p>
              <strong>Email:</strong> {job.hrEmail}
            </p>
            <p>
              <strong>Phone:</strong> {job.hrPhone}
            </p>
          </div>

          <div className="mb-4">
            <h5 className="fw-semibold mb-3">Job Description</h5>
            <p style={{ whiteSpace: "pre-wrap" }}>{job.description}</p>
          </div>

          <div className="d-flex justify-content-between gap-2">
            <button
              className="btn btn-outline-success"
              onClick={() => navigate(`/job-apply`)}
            >
              Apply Now
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate('/jobs-list')}
            >
              ← Back to Jobs
            </button>
            <button
              className="btn btn-outline-warning"
              onClick={() => navigate('/homepage')}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}