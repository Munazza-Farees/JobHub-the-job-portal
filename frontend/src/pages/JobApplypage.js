import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/jobapplypage.css";
import "bootstrap/dist/css/bootstrap.min.css";

function JobApplyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const { user, logout } = useContext(AuthContext);

  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    posFor: "",
    coverLetter: "",
    heardFrom: "",
    resume: null,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);

  // Fetch job details and pre-fill form
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) {
        setMessage("No job ID provided. Redirecting...");
        setTimeout(() => navigate("/homepage"), 2000);
        return;
      }

      if (!user) {
        setMessage("Please log in to apply.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Authentication token missing. Please log in.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      try {
        console.log("Fetching job details with token:", token);
        const jobResponse = await axios.get(`http://localhost:5000/api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Job details:", jobResponse.data);
        setJobDetails(jobResponse.data);
        setFormDetails((prev) => ({
          ...prev,
          name: user.userId?.name || user.name || "",
          email: user.userId?.email || user.email || "",
          phoneNumber: user.phoneNumber || "",
          posFor: jobResponse.data.jobTitle || "",
        }));
      } catch (error) {
        console.error("Error fetching job details:", error.response?.data || error);
        setMessage(error.response?.data?.message || "Failed to load job details.");
        if (error.response?.status === 401) {
          console.warn("Unauthorized access. Logging out...");
          setMessage("Session invalid. Please log in again.");
          logout();
          navigate("/login");
        }
      }
    };

    if (user) fetchJobDetails();
  }, [jobId, user, navigate, logout]);

  // Handle quick apply (for job providers, if applicable)
  const handleQuickApply = async () => {
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Authentication token missing. Please log in.");
      setTimeout(() => navigate("/login"), 2000);
      setLoading(false);
      return;
    }

    try {
      console.log("Submitting quick apply with token:", token);
      const response = await axios.post(
        "http://localhost:5000/api/applications",
        { jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Quick apply response:", response.data);
      setMessage("Application submitted successfully!");
      setTimeout(() => navigate(`/job/${jobId}`), 2000);
    } catch (error) {
      console.error("Quick apply error:", error.response?.data || error);
      const errorMsg = error.response?.data?.error || "Error submitting application.";
      setMessage(errorMsg);
      if (error.response?.status === 401) {
        console.warn("Unauthorized quick apply. Logging out...");
        setMessage(errorMsg.includes("User not found") ? "Account not found. Please register or log in again." : "Session invalid. Please log in again.");
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Client-side validation
    const requiredFields = ["name", "email", "phoneNumber", "posFor"];
    const missingFields = requiredFields.filter(
      (field) => !formDetails[field] || formDetails[field].trim() === ""
    );
    if (missingFields.length > 0) {
      setMessage(`Please fill in: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Authentication token missing. Please log in.");
      setTimeout(() => navigate("/login"), 2000);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("name", formDetails.name);
    formData.append("email", formDetails.email);
    formData.append("phoneNumber", formDetails.phoneNumber);
    formData.append("posFor", formDetails.posFor);
    formData.append("coverLetter", formDetails.coverLetter || "");
    formData.append("heardFrom", formDetails.heardFrom || "");
    if (formDetails.resume instanceof File) {
      formData.append("resume", formDetails.resume);
    }

    console.log("Sending application data:", [...formData]);

    try {
      console.log("Submitting application with token:", token);
      const response = await axios.post("http://localhost:5000/api/applications", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Application response:", response.data);
      setMessage("Application submitted successfully!");
      setTimeout(() => navigate(`/job/${jobId}`), 2000);
    } catch (error) {
      console.error("Submit error:", error.response?.data || error);
      const errorMsg = error.response?.data?.error || "Error submitting application.";
      setMessage(errorMsg);
      if (error.response?.status === 401) {
        console.warn("Unauthorized application submission. Logging out...");
        setMessage(errorMsg.includes("User not found") ? "Account not found. Please register or log in again." : "Session invalid. Please log in again.");
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const onChangeFormDetails = (e) => {
    const { id, value, files } = e.target;
    setFormDetails((prev) => ({
      ...prev,
      [id]: files ? files[0] : value,
    }));
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center mt-4 mb-4">
      <div className="card shadow p-4" style={{ maxWidth: "800px", width: "100%" }}>
        <h2 className="text-center mb-4">Apply Now</h2>
        <p className="text-center abc">
          {jobDetails
            ? `Applying for: ${jobDetails.jobTitle} at ${jobDetails.companyName}`
            : "Loading job details..."}
        </p>
        {message && (
          <div
            className={`alert text-center ${message.includes("successfully") ? "alert-success" : "alert-danger"}`}
          >
            {message}
          </div>
        )}

        {user && (user.role === "jobseeker" || user.role === "jobprovider") ? (
          <>
            {user.role === "jobprovider" && (
              <div className="text-center mb-4">
                <button
                  className="btn btn-outline-primary"
                  onClick={handleQuickApply}
                  disabled={loading || !jobDetails}
                >
                  {loading ? "Applying..." : "Quick Apply"}
                </button>
              </div>
            )}
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <h4>Personal Details</h4>
                <hr />
              </div>
              <div className="row g-3 px-3">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label abc">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter your name"
                    value={formDetails.name}
                    onChange={onChangeFormDetails}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label abc">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="example@gmail.com"
                    value={formDetails.email}
                    onChange={onChangeFormDetails}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="phoneNumber" className="form-label abc">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    placeholder="Phone Number"
                    value={formDetails.phoneNumber}
                    onChange={onChangeFormDetails}
                    required
                  />
                </div>
              </div>

              <div className="mt-4 mb-4">
                <h4>Application Details</h4>
                <hr />
              </div>
              <div className="px-3">
                <div className="mb-3">
                  <label htmlFor="posFor" className="form-label abc">
                    Position You're Applying For
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="posFor"
                    placeholder="Enter the job title"
                    value={formDetails.posFor}
                    onChange={onChangeFormDetails}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="resume" className="form-label abc">
                    Resume/CV (Optional)
                  </label>
                  <div className="p-3 rounded border border-dark bg-light">
                    <input
                      className="form-control form-control-sm"
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={onChangeFormDetails}
                    />
                    <small className="form-text text-muted">
                      Accepted formats: PDF, DOC, DOCX (Max 5MB)
                    </small>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="coverLetter" className="form-label abc">
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    className="form-control"
                    id="coverLetter"
                    placeholder="Why are you interested in this position?"
                    value={formDetails.coverLetter}
                    onChange={onChangeFormDetails}
                    rows="4"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="heardFrom" className="form-label abc">
                    How Did You Hear About Us? (Optional)
                  </label>
                  <select
                    className="form-select"
                    id="heardFrom"
                    value={formDetails.heardFrom}
                    onChange={onChangeFormDetails}
                  >
                    <option value="">Select option</option>
                    <option value="Friend/Colleague">Friend/Colleague</option>
                    <option value="Job Board">Job Board</option>
                    <option value="Social Media">Social Media</option>
                  </select>
                </div>
                <div className="d-flex justify-content-center gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={loading || !jobDetails}
                  >
                    {loading ? "Applying..." : "Apply"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={() => navigate("/jobs-list")}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <p>Please log in to apply.</p>
            <div className="d-flex justify-content-center gap-2">
              <button
                className="btn btn-primary px-4"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={() => navigate("/jobs-list")}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobApplyPage;