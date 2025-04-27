import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ListingItem from "./ListingItem";
import "bootstrap/dist/css/bootstrap.min.css";

export default function JobListingPage() {
  const navigate = useNavigate();
  const { user, setIsLoggedIn } = useContext(AuthContext); // Updated to use setIsLoggedIn
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchListings();
  }, [user, navigate]);

  const fetchListings = async (search = "") => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search,
        },
      });

      const validListings = Array.isArray(data)
        ? data.filter((item) => item && item._id)
        : [];
      setListings(validListings);
    } catch (err) {
      console.error("Error fetching job listings:", err);
      setError("Failed to load job listings. Please try again later.");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings(searchTerm);
  };

  return (
    <div className="container-fluid py-5" style={{ background: "#f5f6fa" }}>
      <div className="container mt-4">
        <h2 className="mb-4 text-center">Job Listings</h2>
        <form onSubmit={handleSearch} className="mb-4">
          <div className="d-flex align-items-center justify-content-center" style={{ gap: '10px', width: '500px' }}>
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={handleChange}

            />
            <button className="btn btn-primary m-1" type="submit">
              Search
            </button>
          </div>
        </form>
        <div className="row justify-content-center">
          {loading ? (
            <div className="text-center">Loading job listings...</div>
          ) : error ? (
            <div className="text-center text-danger">{error}</div>
          ) : listings.length > 0 ? (
            listings.map((listing) => (
              <div
                className="col-12 d-flex justify-content-center mb-4"
                key={listing._id}
              >
                <ListingItem listing={listing} />
              </div>
            ))
          ) : (
            <div className="text-center text-muted">No job listings found.</div>
          )}
        </div>
        {/* Role-based buttons */}
        <div className="d-flex justify-content-center gap-2 mt-4">
          {user?.role === 'jobprovider' && (
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate('/job-provider')}
            >
              Post Job
            </button>
          )}
          {(user?.role === 'jobseeker' || user?.role === 'jobprovider') && (
            <button
              className="btn btn-outline-primary"
              onClick={() => fetchListings()} 
            >
              Refresh Listings
            </button>
          )}
            <button
              className="btn btn-outline-danger"
              onClick={() => navigate("/homepage")}
            >
              Homepage
            </button>
        </div>
      </div>
    </div>
  );
}