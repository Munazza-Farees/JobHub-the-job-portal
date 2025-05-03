import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [relatedData, setRelatedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id || id === "undefined") {
        setError("Invalid user ID. Redirecting to homepage...");
        setTimeout(() => navigate("/"), 3000);
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view profiles.");
          setTimeout(() => navigate("/login"), 3000);
          setLoading(false);
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/users/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.user);
        setRelatedData(res.data.relatedData || {});
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.error || "Failed to load profile.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, navigate]);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-center text-danger py-5">{error}</div>;
  if (!profile) return <div className="text-center py-5">Profile not found.</div>;

  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">{profile.name}'s Profile</h2>
              <div className="row">
                {profile.profilePicture && (
                  <div className="col-md-4 text-center mb-4">
                    <img
                      src={`http://localhost:5000${profile.profilePicture}`}
                      alt="Profile"
                      className="rounded-circle"
                      style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                  </div>
                )}
                <div className="col-md-8">
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Phone:</strong> {profile.phone || "Not provided"}</p>
                  <p><strong>Job Title:</strong> {profile.jobTitle || "Not specified"}</p>
                  <p><strong>Industry:</strong> {profile.industry || "Not specified"}</p>
                  <p><strong>Experience Level:</strong> {profile.experienceLevel || "Not specified"}</p>
                  <p><strong>Skills:</strong> {profile.skills ? profile.skills.split(',').map(skill => skill.trim()).join(', ') : "Not provided"}</p>
                  {profile.education && (
                    <>
                      <p><strong>Education:</strong></p>
                      <p>Degree: {profile.education.degree || "Not specified"}</p>
                      <p>School: {profile.education.school || "Not specified"}</p>
                    </>
                  )}
                  {profile.workExperience && (
                    <>
                      <p><strong>Work Experience:</strong></p>
                      <p>Job Title: {profile.workExperience.jobTitle || "Not specified"}</p>
                      <p>Company: {profile.workExperience.company || "Not specified"}</p>
                      <p>Duration: {profile.workExperience.duration || "Not specified"}</p>
                      <p>Description: {profile.workExperience.description || "Not specified"}</p>
                    </>
                  )}
                </div>
                <div className="d-flex justify-content-center gap-2 mt-3">
                  <button className="btn btn-dark" onClick={() => navigate('/setupProfile')}>
                    Edit Profile
                  </button>
                  <button className="btn btn-primary" onClick={() => navigate('/homepage')}>
                    Homepage
                  </button>
                </div>
              </div>

              {profile.role === "jobProvider" && relatedData.jobsPosted && (
                <div className="mt-5">
                  <h4>Jobs Posted</h4>
                  <hr />
                  {relatedData.jobsPosted.length > 0 ? (
                    <div className="row">
                      {relatedData.jobsPosted.map((job) => (
                        <div key={job._id} className="col-md-6 mb-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <h5 className="card-title">{job.jobTitle}</h5>
                              <p className="card-text"><strong>Company:</strong> {job.companyName}</p>
                              <p className="card-text"><strong>Location:</strong> {job.companyAddress}</p>
                              <p className="card-text"><strong>Salary:</strong> {job.salary || "Not specified"}</p>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => navigate(`/job/${job._id}`)}
                              >
                                View Job
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No jobs posted yet.</p>
                  )}
                </div>
              )}

              {profile.role === "jobSeeker" && relatedData.applications && (
                <div className="mt-5">
                  <h4>Jobs Applied For</h4>
                  <hr />
                  {relatedData.applications.length > 0 ? (
                    <div className="row">
                      {relatedData.applications.map((app) => (
                        <div key={app._id} className="col-md-6 mb-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <h5 className="card-title">{app.jobId?.jobTitle || "Unknown Job"}</h5>
                              <p className="card-text"><strong>Company:</strong> {app.jobId?.companyName || "Unknown"}</p>
                              <p className="card-text"><strong>Applied On:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => navigate(`/job/${app.jobId?._id || ''}`)}
                              >
                                View Job
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No applications submitted yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;