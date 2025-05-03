import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/joblist.css";

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await axios.get("http://localhost:5000/api/jobs");
      setJobs(data);
    };

    fetchJobs();
  }, []);

  return (
    <div className="job-list-container">
      <h1>Available Jobs</h1>
      <div className="job-list">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.company} - {job.location}</p>
              <p className="salary">Salary: {job.salary}</p>
              <p className="description">{job.description}</p>
              <Link to={`/job/${job._id}`} className="details-btn">View Details</Link>
            </div>
          ))
        ) : (
          <p>No jobs found</p>
        )}
      </div>
    </div>
  );
};

export default JobList;

