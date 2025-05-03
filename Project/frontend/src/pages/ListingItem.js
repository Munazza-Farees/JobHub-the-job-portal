import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import companyLogo from "../components/images/company-logo.png";

function ListingItem({ listing }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  if (!listing) {
    return (
      <div className="card h-100 shadow border-0 w-100 p-3 text-muted">
        Invalid job listing data
      </div>
    );
  }

  const {
    _id,
    jobTitle,
    companyName,
    companyAddress,
    requirements,
    imageId,
    salary,
    vacancy,
    experience,
    createdBy,
  } = listing;

  if (!_id) {
    return (
      <div className="card h-100 shadow border-0 w-100 p-3 text-muted">
        Job listing missing ID
      </div>
    );
  }

  const logoSrc = imageId?.path
    ? `http://localhost:5000${imageId.path}`
    : companyLogo;

  const handleApply = (e) => {
    e.stopPropagation();
    navigate(`/job-apply?jobId=${_id}`); // Navigate to apply page
  };

  const handleSaveJob = async (e) => {
    e.stopPropagation();
    try {
      await axios.post(
        "http://localhost:5000/api/saved-jobs",
        { jobId: _id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Job saved successfully!");
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Failed to save job.");
    }
  };

  const handleViewApplications = (e) => {
    e.stopPropagation();
    navigate(`/applications?jobId=${_id}`);
  };

  const handleViewProfile = (e) => {
    e.stopPropagation();
    navigate(`/profile/${createdBy?._id || createdBy}`);
  };

  return (
    <div
      className="card h-100 shadow border-0 w-100"
      style={{
        maxWidth: "700px",
        borderRadius: "16px",
        transition: "transform 0.2s ease-in-out",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/job/${_id}`)}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div className="d-flex align-items-start p-3" style={{ gap: "15px" }}>
        <div>
          <img
            src={logoSrc}
            className="rounded"
            alt={`${companyName || "Company"} Logo`}
            style={{
              width: "70px",
              height: "60px",
              objectFit: "contain",
              borderRadius: "10px",
            }}
            onError={(e) => (e.target.src = companyLogo)}
          />
        </div>
        <div className="flex-grow-1">
          <h5 className="card-title text-primary fw-bold mb-2">
            {jobTitle || "Untitled Job"}
          </h5>
          <p className="card-text mb-1">
            <strong>Company:</strong> {companyName || "N/A"}
          </p>
          <p className="card-text mb-1">
            <strong>Location:</strong> {companyAddress || "N/A"}
          </p>
          <p className="card-text mb-1">
            <strong>Requirements:</strong> {requirements || "Not specified"}
          </p>
          {vacancy && (
            <p className="card-text mb-1">
              <strong>Vacancies:</strong> {vacancy}
            </p>
          )}
          {experience && (
            <p className="card-text mb-1">
              <strong>Experience:</strong> {experience || "Not specified"}
            </p>
          )}
          {salary && (
            <p className="card-text mb-2">
              <span className="badge bg-success fs-6">₹{salary} / annum</span>
            </p>
          )}
          <div className="d-flex gap-2">
            {user?.role === "jobSeeker" && (
              <>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleApply}
                >
                  Apply
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleSaveJob}
                >
                  Save Job
                </button>
              </>
            )}
            {user?.role === "jobProvider" && createdBy?._id === user?.userId?._id && (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleViewApplications}
              >
                View Applications
              </button>
            )}
            {user?.role === "jobProvider" && createdBy && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleViewProfile}
              >
                View Provider Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingItem;