import React, { useState, useEffect } from "react";
import axios from "axios";
import ListingItem from "./ListingItem";

export default function SearchPage() {
  const [filters, setFilters] = useState({
    search: "",
    region: "",
    jobType: "",
    experience: "",
  });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    const { search, region, jobType, experience } = filters;

    try {
      const { data } = await axios.get("http://localhost:5000/api/jobs", {
        params: {
          search,
          region: region || undefined,
          jobType: jobType || undefined,
          experience: experience || undefined,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Ensure data is an array and filter out invalid entries
      const validListings = Array.isArray(data) ? data.filter((item) => item && item._id) : [];
      setListings(validListings);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setError("Failed to load job listings. Please try again later.");
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitFilters = async (e) => {
    e.preventDefault();
    await fetchListings();
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="container-fluid">
      <header style={{ height: "100px" }}>
        <div className="container-fluid" style={{ fontFamily: "Arial" }}>
          <nav
            className="navbar navbar-expand-lg navbar-light p-3"
            style={{ backgroundColor: "#37ABC8" }}
          >
            <a className="navbar-brand fw-bold text-white" href="#">
              JobHub
            </a>
            <div className="d-flex ms-auto">
              <button
                className="btn text-black me-2"
                onClick={() => (window.location.href = "/")}
              >
                Back to Home
              </button>
              <button
                className="btn text-black"
                onClick={() => (window.location.href = "/login")}
              >
                Log in
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div className="row mt-4">
        <div className="col-xl-3 p-3 ms-4">
          <form onSubmit={onSubmitFilters}>
            <div className="rounded-3 p-3 shadow bg-white">
              <h6 className="mb-3 fw-bold">Filters</h6>
              <div className="mb-3">
                <label htmlFor="search" className="form-label">
                  Search
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="search"
                  value={filters.search}
                  onChange={handleChange}
                  placeholder="Job title or company"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="region" className="form-label">
                  Region
                </label>
                <select
                  className="form-select"
                  id="region"
                  value={filters.region}
                  onChange={handleChange}
                >
                  <option value="">All Regions</option>
                  <option value="New Delhi">New Delhi</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="jobType" className="form-label">
                  Job Type
                </label>
                <select
                  className="form-select"
                  id="jobType"
                  value={filters.jobType}
                  onChange={handleChange}
                >
                  <option value="">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="experience" className="form-label">
                  Experience (Years)
                </label>
                <select
                  className="form-select"
                  id="experience"
                  value={filters.experience}
                  onChange={handleChange}
                >
                  <option value="">Any</option>
                  <option value="0">Fresher</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="5">5+</option>
                </select>
              </div>
              <button type="submit" className="btn btn-outline-dark w-100 mt-3">
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        <div className="col-xl-8 p-3">
          <div className="mb-3">
            <h5 className="fw-bold">
              {listings.length} Jobs Found
            </h5>
          </div>
          <div className="row">
            {loading ? (
              <div className="text-center">Loading listings...</div>
            ) : error ? (
              <div className="text-center text-danger">{error}</div>
            ) : listings.length > 0 ? (
              listings.map((listing, index) => (
                <div
                  className="col-12 d-flex justify-content-center mb-4"
                  key={listing._id || index}
                >
                  <ListingItem listing={listing} />
                </div>
              ))
            ) : (
              <div className="text-muted">No listings found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}