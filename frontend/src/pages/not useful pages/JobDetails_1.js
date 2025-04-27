import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/jobdetails.css";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (!job) {
    return <p>Loading job details...</p>;
  }

  return (
    <div className="job-details-container">
      <h1>{job.title}</h1>
      <h3>{job.company} - {job.location}</h3>
      <p className="salary">Salary: {job.salary}</p>
      <p className="description">{job.description}</p>
      <button className="apply-btn">Apply Now</button>
    </div>
  );
};

export default JobDetails;

