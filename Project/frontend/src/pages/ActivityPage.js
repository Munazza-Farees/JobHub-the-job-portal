import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ActivityPage = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view activities.");
        setTimeout(() => navigate("/login"), 2000);
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching activities with token:", token);
        const response = await axios.get("http://localhost:5000/api/activities", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Activities fetched:", response.data);
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error.response?.data || error);
        const errorMsg = error.response?.data?.error || "Failed to load activities.";
        setError(errorMsg);
        if (error.response?.status === 401) {
          setError(errorMsg.includes("User not found") ? "Account not found. Please log in again." : "Session expired. Please log in.");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/login"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [navigate]); // Only depend on navigate to avoid loops

  return (
    <div className="container-fluid">
      <div className="container py-5">
        <h2 className="mb-4">Your Activity</h2>
        <div className="card shadow-sm border-0">
          <div className="card-body">
            {loading ? (
              <p className="text-muted">Loading activities...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : activities.length > 0 ? (
              activities.map((activity, index) => (
                <div key={activity._id || index}>
                  <p className="mb-2">
                    {activity.action} <small className="text-muted">({new Date(activity.createdAt).toLocaleString()})</small>
                  </p>
                  {index < activities.length - 1 && <hr />}
                </div>
              ))
            ) : (
              <p className="text-muted">No activities found.</p>
            )}
            <div className="d-flex mt-3">
              <button className="btn btn-outline-success" onClick={() => navigate(-1)} disabled={loading}>
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;