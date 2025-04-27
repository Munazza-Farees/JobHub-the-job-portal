import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/jobform.css";

const JobProviderPage = () => {
  const navigate = useNavigate();
  const [job, setJob] = useState({
    companyName: "",
    hrName: "",
    hrEmail: "",
    hrPhone: "",
    jobTitle: "",
    description: "",
    skills: "",
    companyAddress: "",
    imageId: "", // Replace companyLogo with imageId
    jobType: "",
    experience: "",
    vacancy: "",
    salary: "",
    region: "",
  });
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const salaryRegex = /^(\$[0-9,]+(k|K)?(\s?-\s?\$[0-9,]+(k|K)?)?|\d+(k|K)?(\s?-\s?\d+(k|K)?)?)$/;
  const phoneRegex = /^\d{10}$/;
  const skillsRegex = /^[a-zA-Z\s,]+$/;

  useEffect(() => {
    const fetchImages = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please log in to fetch images.");
        return;
      }
      try {
        const response = await axios.get("http://localhost:5000/api/images", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setImages(response.data);
        if (response.data.length > 0) {
          setJob((prev) => ({ ...prev, imageId: response.data[0]._id }));
        }
      } catch (error) {
        setMessage("Error fetching images: " + (error.response?.data?.error || error.message));
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "hrName") {
      setJob({ ...job, [name]: value.toUpperCase() });
    } else {
      setJob({ ...job, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please log in to post a job.");
      setLoading(false);
      return;
    }

    const requiredFields = ["jobTitle", "description", "companyName", "companyAddress", "salary", "skills"];
    const missingFields = requiredFields.filter((field) => !job[field] || job[field].trim() === "");
    if (missingFields.length > 0) {
      setMessage(`Missing required fields: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }

    if (!phoneRegex.test(job.hrPhone)) {
      setMessage("Phone number must be exactly 10 digits.");
      setLoading(false);
      return;
    }
    if (job.salary && !salaryRegex.test(job.salary)) {
      setMessage("Invalid salary format. Examples: $50k, 120K - 150K");
      setLoading(false);
      return;
    }
    if (job.skills && !skillsRegex.test(job.skills)) {
      setMessage("Skills must be comma-separated (e.g., UI/UX, Figma).");
      setLoading(false);
      return;
    }

    const jobData = {
      jobTitle: job.jobTitle,
      description: job.description,
      companyName: job.companyName,
      companyAddress: job.companyAddress,
      salary: job.salary,
      skills: job.skills,
      hrName: job.hrName,
      hrEmail: job.hrEmail,
      hrPhone: job.hrPhone,
      imageId: job.imageId || undefined, // Use selected imageId
      jobType: job.jobType,
      experience: job.experience,
      vacancy: job.vacancy,
      region: job.region,
    };

    console.log("Sending job data to /api/jobs:", jobData);

    try {
      const response = await axios.post("http://localhost:5000/api/jobs", jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // JSON instead of multipart/form-data
        },
      });
      setMessage("Job posted successfully!");
      setJob({
        companyName: "",
        hrName: "",
        hrEmail: "",
        hrPhone: "",
        jobTitle: "",
        description: "",
        skills: "",
        companyAddress: "",
        imageId: images[0]?._id || "",
        jobType: "",
        experience: "",
        vacancy: "",
        salary: "",
        region: "",
      });
      console.log("Job Posted Response:", response.data);
      navigate("/homepage");
    } catch (error) {
      console.error("Submit error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      setMessage("Error posting job: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-gray-100 py-10 d-flex justify-content-center align-items-center">
      <div className="card shadow-sm p-5 w-100" style={{ maxWidth: "900px" }}>
        <h2 className="card-title text-center fw-bold mb-4">Post a New Job</h2>
        {message && (
          <div
            className={`alert ${
              message.includes("successfully") ? "alert-success" : "alert-danger"
            } text-center mb-4`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="companyName" className="form-label fw-medium">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={job.companyName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="hrName" className="form-label fw-medium">
                HR Name (Uppercase)
              </label>
              <input
                type="text"
                id="hrName"
                name="hrName"
                value={job.hrName}
                onChange={handleChange}
                className="form-control text-uppercase"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="hrEmail" className="form-label fw-medium">
                HR Email
              </label>
              <input
                type="email"
                id="hrEmail"
                name="hrEmail"
                value={job.hrEmail}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="hrPhone" className="form-label fw-medium">
                HR Phone (10 digits)
              </label>
              <input
                type="tel"
                id="hrPhone"
                name="hrPhone"
                value={job.hrPhone}
                onChange={handleChange}
                maxLength="10"
                className="form-control"
                required
              />
            </div>
            <div className="col-12">
              <label htmlFor="companyAddress" className="form-label fw-medium">
                Company Address
              </label>
              <textarea
                id="companyAddress"
                name="companyAddress"
                value={job.companyAddress}
                onChange={handleChange}
                rows="2"
                className="form-control"
                required
              />
            </div>
            <div className="col-12">
              <label htmlFor="imageId" className="form-label fw-medium">
                Select Company Logo
              </label>
              <select
                id="imageId"
                name="imageId"
                value={job.imageId}
                onChange={handleChange}
                className="form-select"
                disabled={images.length === 0}
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
              <label htmlFor="jobTitle" className="form-label fw-medium">
                Job Title
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={job.jobTitle}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-12">
              <label htmlFor="description" className="form-label fw-medium">
                Job Description
              </label>
              <textarea
                id="description"
                name="description"
                value={job.description}
                onChange={handleChange}
                rows="4"
                className="form-control"
                required
              />
            </div>
            <div className="col-12">
              <label htmlFor="skills" className="form-label fw-medium">
                Skills
              </label>
              <textarea
                id="skills"
                name="skills"
                value={job.skills}
                onChange={handleChange}
                rows="3"
                className="form-control"
                placeholder="e.g., UI/UX, Figma"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="jobType" className="form-label fw-medium">
                Job Type
              </label>
              <select
                id="jobType"
                name="jobType"
                value={job.jobType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="experience" className="form-label fw-medium">
                Experience (Years)
              </label>
              <input
                id="experience"
                type="text"
                name="experience"
                value={job.experience}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., 5+"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="vacancy" className="form-label fw-medium">
                Vacancies
              </label>
              <input
                id="vacancy"
                type="number"
                name="vacancy"
                value={job.vacancy}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter number of vacancies"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="salary" className="form-label fw-medium">
                Salary
              </label>
              <input
                id="salary"
                type="text"
                name="salary"
                value={job.salary}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., 120K - 150K"
                required
              />
            </div>
            <div className="col-12">
              <label htmlFor="region" className="form-label fw-medium">
                Region
              </label>
              <input
                id="region"
                type="text"
                name="region"
                value={job.region}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., New Delhi"
              />
            </div>
            <div className="col-12 d-flex d-grid gap-2 justify-content-center align-items-center">
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 mt-3"
                disabled={loading}
              >
                {loading ? "Posting..." : "Post Job"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary w-100 py-2 mt-3"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobProviderPage;