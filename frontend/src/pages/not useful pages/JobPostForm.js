import React, { useState } from "react";
import axios from "axios";
import "../styles/jobform.css";
import { useNavigate } from "react-router-dom";

const JobForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Regex validations
  const salaryRegex = /^(\$[0-9,]+(k|K)?(\s?-\s?\$[0-9,]+(k|K)?)?|\d+(k|K)?(\s?-\s?\d+(k|K)?)?)$/; // Flexible for "$50k" or "120K - 150K"
  const phoneRegex = /^\d{10}$/; // 10-digit phone number
  const skillsRegex = /^[a-zA-Z\s,]+$/; // Comma-separated skills

  const [formData, setFormData] = useState({
    companyName: "",
    hrName: "",
    hrEmail: "",
    hrPhone: "",
    jobTitle: "",
    jobDescription: "",
    requirements: "",
    companyAddress: "",
    image: null, // File input for image upload
    jobType: "",
    experience: "",
    vacancy: "",
    salary: "",
    region: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!phoneRegex.test(formData.hrPhone)) {
      setError("Phone number must be exactly 10 digits.");
      setLoading(false);
      return;
    }
    if (formData.salary && !salaryRegex.test(formData.salary)) {
      setError("Invalid salary format. Examples: $50k, 120K - 150K");
      setLoading(false);
      return;
    }
    if (formData.requirements && !skillsRegex.test(formData.requirements)) {
      setError("Requirements must be comma-separated skills (e.g., UI/UX, Figma).");
      setLoading(false);
      return;
    }
    if (!formData.image) {
      setError("Please upload a company logo.");
      setLoading(false);
      return;
    }

    // Prepare form data for upload
    const jobData = new FormData();
    jobData.append("companyName", formData.companyName);
    jobData.append("hrName", formData.hrName);
    jobData.append("hrEmail", formData.hrEmail);
    jobData.append("hrPhone", formData.hrPhone);
    jobData.append("jobTitle", formData.jobTitle);
    jobData.append("jobDescription", formData.jobDescription);
    jobData.append("requirements", formData.requirements);
    jobData.append("companyAddress", formData.companyAddress);
    jobData.append("image", formData.image); // File upload
    jobData.append("jobType", formData.jobType);
    jobData.append("experience", formData.experience);
    jobData.append("vacancy", formData.vacancy);
    jobData.append("salary", formData.salary);
    jobData.append("region", formData.region);

    try {
      const response = await axios.post("http://localhost:5000/api/jobs", jobData, {
        headers: {
          "Content-Type": "multipart/form-data", // For file upload
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Job posted successfully!");
      setFormData({
        companyName: "",
        hrName: "",
        hrEmail: "",
        hrPhone: "",
        jobTitle: "",
        jobDescription: "",
        requirements: "",
        companyAddress: "",
        image: null,
        jobType: "",
        experience: "",
        vacancy: "",
        salary: "",
        region: "",
      });
      navigate("/jobs");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "An unknown error occurred";
      setError("Error posting job: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-form-container">
      <h1>Post a New Job</h1>
      {error && (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      )}
      <div className="card p-3">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              id="companyName"
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="hrName">HR Name</label>
            <input
              id="hrName"
              type="text"
              name="hrName"
              value={formData.hrName}
              onChange={handleChange}
              placeholder="Enter HR name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="hrEmail">HR Email</label>
            <input
              id="hrEmail"
              type="email"
              name="hrEmail"
              value={formData.hrEmail}
              onChange={handleChange}
              placeholder="Enter HR email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="hrPhone">HR Phone</label>
            <input
              id="hrPhone"
              type="text"
              name="hrPhone"
              value={formData.hrPhone}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="jobTitle">Job Title</label>
            <input
              id="jobTitle"
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="Enter job title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="jobDescription">Job Description</label>
            <textarea
              rows={3}
              cols={22}
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Enter job details"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="requirements">Requirements</label>
            <input
              id="requirements"
              type="text"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="e.g., UI/UX, Figma"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyAddress">Company Address</label>
            <input
              id="companyAddress"
              type="text"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              placeholder="Enter company address"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Company Logo</label>
            <input
              id="image"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="jobType">Job Type</label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
            >
              <option value="">Select Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="experience">Experience (Years)</label>
            <input
              id="experience"
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g., 5+"
            />
          </div>
          <div className="form-group">
            <label htmlFor="vacancy">Vacancies</label>
            <input
              id="vacancy"
              type="number"
              name="vacancy"
              value={formData.vacancy}
              onChange={handleChange}
              placeholder="Enter number of vacancies"
            />
          </div>
          <div className="form-group">
            <label htmlFor="salary">Salary</label>
            <input
              id="salary"
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g., 120K - 150K"
            />
          </div>
          <div className="form-group">
            <label htmlFor="region">Region</label>
            <input
              id="region"
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="e.g., New Delhi"
            />
          </div>
          <div className="d-flex d-grid gap-2">
            <button className="" type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post Job"}
            </button>
            <button className="" type="cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;