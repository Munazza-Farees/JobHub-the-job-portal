import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SaveComponent from '../components/images/Save component.png';
import ProfilePicture from '../components/images/Profile picture.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const Homepage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [news, setNews] = useState([]);
  const [skills, setSkills] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      setLoading(true);
      setErrorMessage(null);
      try {
        const [profileResponse, jobsResponse, newsResponse, skillsResponse, activityResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/jobs'),
          axios.get('http://localhost:5000/api/news'),
          axios.get('http://localhost:5000/api/skills', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          // Fetch only the 5 most recent activities
          axios.get('http://localhost:5000/api/activities', {
            headers: { Authorization: `Bearer ${token}` },
            params: { limit: 5 }, // Pass limit as a query parameter
          }),
        ]);

        setUser(profileResponse.data);
        setJobs(jobsResponse.data);
        setNews(newsResponse.data.slice(0, 5)); // Limit to top 5 news
        setSkills(skillsResponse.data);
        setActivities(activityResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Failed to load data.');
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    try {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    } catch (error) {
      console.error('Error navigating to search:', error);
      setErrorMessage('Failed to perform search.');
    }
  };

  const truncateDescription = (description, maxLength = 100) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  return (
    <div className="container-fluid p-0" style={{ fontFamily: 'Arial' }}>
      <div className="body-div p-5">
        <div className="row mt-4 d-flex align-items-stretch">
          <div className="col-lg-8 col-md-6 col-12 mb-3">
            <form onSubmit={handleSubmit} className="p-0 mb-3">
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-2 m-1"
                  placeholder="Search for news, companies..."
                  value={searchTerm}
                  onChange={handleChange}
                  style={{ color: 'black', flexGrow: 1, width: '400px' }}
                />
                <button
                  className="btn btn-outline-secondary m-1"
                  type="submit"
                  style={{
                    width: '100px',
                    border: '1px solid rgba(0, 0, 0, 0.175)',
                  }}
                >
                  Search
                </button>
              </div>
            </form>

            <div className="card p-3 h-auto mb-3">
              <h5>Company News</h5>
              <ul className="list-group list-group-flush">
                {loading ? (
                  <p>Loading news...</p>
                ) : errorMessage && news.length === 0 ? (
                  <p className="text-danger">{errorMessage}</p>
                ) : news.length > 0 ? (
                  news.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="xyz mb-3 mt-3 d-flex align-items-center"
                      style={{ borderBottom: '1px dotted rgba(0, 0, 0, 0.175)' }}
                    >
                      <div className="company-logos w-auto">
                        <img
                          src={item.imageId?.path ? `http://localhost:5000${item.imageId.path}` : ProfilePicture}
                          className="list-group-logo ml-2 mt-2"
                          alt={item.company || 'Company'}
                          style={{ width: 70, height: 50, borderRadius: '10px', objectFit: 'contain' }}
                          onError={(e) => {
                            e.target.src = ProfilePicture;
                          }}
                        />
                      </div>
                      <div className="company-details w-100">
                        <li className="list-group-item justify-content-between w-auto h-auto" style={{ border: 'none' }}>
                          <strong>{item.title || 'Untitled'}</strong>
                          <p>{truncateDescription(item.description || 'No description available')}</p>
                          <a
                            href={`/news#news-${item._id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/news#news-${item._id}`);
                            }}
                            className="text-primary"
                          >
                            Read More
                          </a>
                        </li>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No news available</p>
                )}
              </ul>
              <div className='d-flex d-grid gap-2 justify-content-center m-3'>
                <button className='btn btn-outline-warning' onClick={() => navigate('/upload-news')}>Post News</button>
                <button className='btn btn-outline-danger' onClick={() => navigate('/news')}>View More</button>
              </div>
            </div>

            <div className="card p-3 h-auto">
              <h5>Recommended for You</h5>
              <div className="d-flex justify-content-between mb-3 position-relative flex-wrap">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <div className="card p-3 mb-3 m-3" key={job._id} style={{ width: '100%' }}>
                      <div className="d-flex d-grid gap-1">
                        <img
                          src={job.imageId?.path ? `http://localhost:5000${job.imageId.path}` : ProfilePicture}
                          alt={job.companyName || 'Company'}
                          style={{ width: 70, height: 50, borderRadius: '10px', marginBottom: '10px', objectFit: 'contain' }}
                        />
                        <div className="m-3">
                          <h6>{job.jobTitle}</h6>
                        </div>
                        <div className="card-save-button" style={{ position: 'absolute', top: '10px', right: '20px', zIndex: 10 }}>
                          <img src={SaveComponent} className="save-component-btn" alt="save" style={{ width: 15, height: 15 }} />
                        </div>
                      </div>
                      <div>
                        <p>
                          <strong>{job.companyName}</strong><br />
                          <strong>Address: </strong>{job.companyAddress}<br /><hr />
                          {job.description}
                        </p>
                        <h6>{job.jobDescription}</h6>
                      </div>
                      <div className="d-flex d-grid gap-1">
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate(`/job-apply?jobId=${job._id || job.id}`)}
                          disabled={loading}
                        >
                          Apply Now
                        </button>
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => navigate(`/job/${job._id || job.id}`)}
                          disabled={loading}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No jobs found</p>
                )}
                <div className="d-flex gap-2 justify-content-center m-3 w-100">
                  {user?.role === "jobprovider" && (
                    <button className="btn btn-outline-primary" onClick={() => navigate("/job-provider")} disabled={loading}>
                      Post Job
                    </button>
                  )}
                  {(user?.role === "jobseeker" || user?.role === "jobprovider") && (
                    <button className="btn btn-success" onClick={() => navigate("/jobs-list")} disabled={loading}>
                      View More
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-12">
            <div className="card p-3 mb-3 text-center">
              {user ? (
                <>
                  <div className="card-upper-part">
                    <img
                      src={user.profilePicture ? `http://localhost:5000${user.profilePicture}` : ProfilePicture}
                      className="mx-auto"
                      style={{ borderRadius: '50%', width: '150px', height: '150px' }}
                      alt="Profile"
                    />
                    <h5 className="mt-2">{user.userId?.name || user.name}</h5>
                    <p className="paragraph" style={{ color: 'grey', fontSize: '16px' }}>
                      {user.jobTitle} <br />
                      {user.role === 'jobprovider' ? 'Employer' : 'Job Seeker'}
                      {user.company}
                    </p>
                  </div>
                  <div className="card-lower-part">
                    <ul className="list-group list-group-flush" style={{ flexDirection: 'row' }}>
                      <li className="list-group-item text-center flex-fill" style={{ border: 'none' }}>
                        <h5>{user.applicationsCount || 2}</h5>
                        <h5>Applications</h5>
                      </li>
                      <li className="list-group-item text-center flex-fill">
                        <h5>{user.savedJobsCount || 10}</h5>
                        <h5>Saved jobs</h5>
                      </li>
                    </ul>
                    <div className="d-flex" style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <button
                        className="btn btn-dark m-2 w-auto h-auto"
                        onClick={() => navigate(`/profile/${user.userId?._id || user._id}`)}
                        disabled={loading}
                      >
                        View profile
                      </button>
                      <button className="btn btn-dark m-2 w-auto h-auto" onClick={() => navigate('/setupProfile')}>
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p>Loading user profile...</p>
              )}
            </div>
            <div className="card p-3 mb-3">
              <h5>Skills</h5>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <span key={index} className="badge bg-light text-dark fw-semibold px-2 py-2">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p>No skills added yet</p>
                )}
              </div>
            </div>

            <div className="card shadow-sm border-0" style={{ maxWidth: '400px', margin: '0 auto' }}>
              <div className="card-body">
                <h5 className="card-title fw-bold">Recent Activity</h5>
                <hr />
                {loading ? (
                  <p className="text-muted">Loading activities...</p>
                ) : errorMessage ? (
                  <p className="text-danger">{errorMessage}</p>
                ) : activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <div key={activity._id || index}>
                      <p className="mb-2">
                        {activity.action}{' '}
                        <small className="text-muted">({new Date(activity.createdAt).toLocaleString()})</small>
                      </p>
                      {index < activities.length - 1 && <hr />}
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No recent activities.</p>
                )}
                <div className="text-center mt-3">
                  <button className="btn btn-outline-primary" onClick={() => navigate('/activities')}>
                    View all activity
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;