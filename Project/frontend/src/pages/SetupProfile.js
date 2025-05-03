// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import defaultAvatar from '../components/images/default-avatar.png';
// import { AuthContext } from '../context/AuthContext'; 
// import 'bootstrap/dist/css/bootstrap.min.css';

// const SetupProfile = () => {
//   const { setUser } = useContext(AuthContext);
//   console.log('setUser: ', setUser); 
//   const navigate = useNavigate();
//   const [editMode, setEditMode] = useState(true);
//   const [profile, setProfile] = useState({
//     fullName: '',
//     phoneNumber: '',
//     jobTitle: '',
//     industry: '',
//     experienceLevel: '',
//     skills: '',
//     profilePicture: '',
//     role: 'jobseeker',
//     education: { degree: '', school: '' },
//     workExperience: { jobTitle: '', company: '', duration: '', description: '' },
//   });
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) throw new Error('No token found in localStorage');
//         console.log('Fetching profile with token:', token);
//         const response = await axios.get('http://localhost:5000/api/auth/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setProfile(response.data || {});
//       } catch (error) {
//         console.error('Error fetching profile:', error.response?.data || error.message);
//         setError('Failed to load profile: ' + (error.response?.data?.message || error.message));
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfile((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleNestedChange = (e, section) => {
//     const { name, value } = e.target;
//     setProfile((prev) => ({
//       ...prev,
//       [section]: { ...prev[section], [name]: value },
//     }));
//   };

//   const handleFileChange = (e) => {
//     setProfile((prev) => ({ ...prev, profilePicture: e.target.files[0] }));
//   };

//   const handleUpdate = async () => {
//     setError('');
//     if (!profile.role) {
//       setError('Please select a role (Job Seeker or Job Provider)');
//       return;
//     }
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No token found in localStorage');
//       console.log('Updating profile with token:', token);

//       const formData = new FormData();
//       Object.keys(profile).forEach((key) => {
//         if (key === 'education' || key === 'workExperience') {
//           Object.keys(profile[key]).forEach((nestedKey) => {
//             const value = profile[key][nestedKey] || '';
//             formData.append(`${key}.${nestedKey}`, value);
//             console.log(`Appending ${key}.${nestedKey}: ${value}`);
//           });
//         } else if (key !== 'profilePicture') {
//           const value = profile[key] || '';
//           formData.append(key, value);
//           console.log(`Appending ${key}: ${value}`);
//         }
//       });
//       if (profile.profilePicture instanceof File) {
//         formData.append('profilePicture', profile.profilePicture);
//         console.log('Appending profilePicture:', profile.profilePicture.name);
//       }

//       const response = await axios.put('http://localhost:5000/api/auth/profile', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       // setUser(response.data); // Now uses context
//       navigate('/homepage');
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Error updating profile';
//       setError(errorMessage);
//       console.error('Error updating profile:', error.response?.data || error.message);
//     }
//   };

//   return (
//     <div className="container-fluid p-5">
//       <div className="card p-5 shadow-sm" style={{ maxWidth: '800px', margin: '0 auto' }}>
//         <h4 className="text-center fw-bold">Setup Your Profile</h4>
//         {error && <p className="text-danger text-center">{error}</p>}
//         <form onSubmit={(e) => e.preventDefault()}>
//           <input
//             type="text"
//             name="fullName"
//             className="form-control mb-2"
//             placeholder="Full Name"
//             value={profile.fullName || ''}
//             onChange={handleChange}
//           />
//           <input
//             type="tel"
//             name="phoneNumber"
//             className="form-control mb-2"
//             placeholder="Phone Number"
//             value={profile.phoneNumber || ''}
//             onChange={handleChange}
//           />
//           <input
//             type="text"
//             name="jobTitle"
//             className="form-control mb-2"
//             placeholder="Job Title"
//             value={profile.jobTitle || ''}
//             onChange={handleChange}
//           />
//           <select
//             name="industry"
//             className="form-select mb-2"
//             value={profile.industry || ''}
//             onChange={handleChange}
//           >
//             <option value="">Select Industry</option>
//             <option value="Software">Software</option>
//             <option value="Health">Health</option>
//             <option value="Finance">Finance</option>
//             <option value="Design">Design</option>
//           </select>
//           <select
//             name="experienceLevel"
//             className="form-select mb-2"
//             value={profile.experienceLevel || ''}
//             onChange={handleChange}
//           >
//             <option value="">Select Experience Level</option>
//             <option value="Student">Student</option>
//             <option value="1-2 years">1-2 years</option>
//             <option value="3-5 years">3-5 years</option>
//             <option value="5-7 years">5-7 years</option>
//           </select>
//           <input
//             type="text"
//             name="skills"
//             className="form-control mb-2"
//             placeholder="Skills"
//             value={profile.skills || ''}
//             onChange={handleChange}
//           />

//           <div className="d-flex m-3">
//             <label className="form-label fw-bold me-5">Role</label>
//             <div>
//               <div className="form-check form-check-inline">
//                 <input
//                   type="radio"
//                   name="role"
//                   value="jobseeker"
//                   checked={profile.role === 'jobseeker'}
//                   onChange={handleChange}
//                   className="form-check-input"
//                   id="jobseeker"
//                   required
//                 />
//                 <label htmlFor="jobseeker" className="form-check-label">Job Seeker</label>
//               </div>
//               <div className="form-check form-check-inline">
//                 <input
//                   type="radio"
//                   name="role"
//                   value="jobprovider"
//                   checked={profile.role === 'jobprovider'}
//                   onChange={handleChange}
//                   className="form-check-input"
//                   id="jobprovider"
//                   required
//                 />
//                 <label htmlFor="jobprovider" className="form-check-label">Job Provider</label>
//               </div>
//             </div>
//           </div>

//           <h6 className="fw-bold mt-3">Education</h6>
//           <input
//             type="text"
//             name="degree"
//             className="form-control mb-2"
//             placeholder="Degree"
//             value={profile.education?.degree || ''}
//             onChange={(e) => handleNestedChange(e, 'education')}
//           />
//           <input
//             type="text"
//             name="school"
//             className="form-control mb-2"
//             placeholder="School"
//             value={profile.education?.school || ''}
//             onChange={(e) => handleNestedChange(e, 'education')}
//           />

//           <h6 className="fw-bold mt-3">Work Experience</h6>
//           <input
//             type="text"
//             name="jobTitle"
//             className="form-control mb-2"
//             placeholder="Job Title"
//             value={profile.workExperience?.jobTitle || ''}
//             onChange={(e) => handleNestedChange(e, 'workExperience')}
//           />
//           <input
//             type="text"
//             name="company"
//             className="form-control mb-2"
//             placeholder="Company"
//             value={profile.workExperience?.company || ''}
//             onChange={(e) => handleNestedChange(e, 'workExperience')}
//           />
//           <input
//             type="text"
//             name="duration"
//             className="form-control mb-2"
//             placeholder="Duration"
//             value={profile.workExperience?.duration || ''}
//             onChange={(e) => handleNestedChange(e, 'workExperience')}
//           />
//           <textarea
//             name="description"
//             className="form-control mb-3"
//             placeholder="Description"
//             value={profile.workExperience?.description || ''}
//             onChange={(e) => handleNestedChange(e, 'workExperience')}
//           />

//           <input type="file" accept="image/*" className="form-control mb-3" onChange={handleFileChange} />

//           <div className="d-flex justify-space-around m-2">
//             <button type="button" className="btn btn-primary m-2" onClick={handleUpdate}>
//               Save Profile
//             </button>
//             <button type="button" className="btn btn-warning m-2" onClick={() => navigate('/homepage')}>
//               Homepage
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SetupProfile;
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultAvatar from '../components/images/default-avatar.png';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const SetupProfile = () => {
  const { setUser } = useContext(AuthContext);
  console.log('setUser: ', setUser);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(true);
  const [profile, setProfile] = useState({
    fullName: '',
    phoneNumber: '',
    jobTitle: '',
    industry: '',
    experienceLevel: '',
    skills: '',
    profilePicture: null, // Initialize as null to avoid issues
    role: 'jobseeker',
    education: { degree: '', school: '' },
    workExperience: { jobTitle: '', company: '', duration: '', description: '' },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          navigate('/login');
          return;
        }
        console.log('Fetching profile with token:', token);
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Profile fetched:', response.data);
        setProfile({ ...response.data, profilePicture: null }); // Reset profilePicture to avoid file issues
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error('Error fetching profile:', error.response?.data || error);
        setError(`Failed to load profile: ${errorMessage}`);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (e, section) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [section]: { ...prev[section], [name]: value },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfile((prev) => ({ ...prev, profilePicture: file }));
  };

  const handleUpdate = async () => {
    setError('');
    setLoading(true);

    if (!profile.role) {
      setError('Please select a role (Job Seeker or Job Provider)');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        navigate('/login');
        return;
      }
      console.log('Updating profile with token:', token);

      const formData = new FormData();
      Object.keys(profile).forEach((key) => {
        if (key === 'education' || key === 'workExperience') {
          Object.keys(profile[key]).forEach((nestedKey) => {
            const value = profile[key][nestedKey] || '';
            formData.append(`${key}.${nestedKey}`, value);
            console.log(`Appending ${key}.${nestedKey}: ${value}`);
          });
        } else if (key !== 'profilePicture') {
          const value = profile[key] || '';
          formData.append(key, value);
          console.log(`Appending ${key}: ${value}`);
        }
      });

      if (profile.profilePicture instanceof File) {
        formData.append('profilePicture', profile.profilePicture);
        console.log('Appending profilePicture:', profile.profilePicture.name);
      }

      const response = await axios.put('http://localhost:5000/api/auth/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Profile updated:', response.data);
      setUser(response.data); // Update AuthContext
      setLoading(false);
      navigate('/homepage');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error updating profile';
      console.error('Error updating profile:', error.response?.data || error);
      setError(errorMessage);
      setLoading(false);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setError('Session expired. Please log in again.');
        navigate('/login');
      }
    }
  };

  return (
    <div className="container-fluid p-5">
      <div className="card p-5 shadow-sm" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h4 className="text-center fw-bold">Setup Your Profile</h4>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            name="fullName"
            className="form-control mb-2"
            placeholder="Full Name"
            value={profile.fullName || ''}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phoneNumber"
            className="form-control mb-2"
            placeholder="Phone Number"
            value={profile.phoneNumber || ''}
            onChange={handleChange}
          />
          <input
            type="text"
            name="jobTitle"
            className="form-control mb-2"
            placeholder="Job Title"
            value={profile.jobTitle || ''}
            onChange={handleChange}
          />
          <select
            name="industry"
            className="form-select mb-2"
            value={profile.industry || ''}
            onChange={handleChange}
          >
            <option value="">Select Industry</option>
            <option value="Software">Software</option>
            <option value="Health">Health</option>
            <option value="Finance">Finance</option>
            <option value="Design">Design</option>
          </select>
          <select
            name="experienceLevel"
            className="form-select mb-2"
            value={profile.experienceLevel || ''}
            onChange={handleChange}
          >
            <option value="">Select Experience Level</option>
            <option value="Student">Student</option>
            <option value="1-2 years">1-2 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5-7 years">5-7 years</option>
          </select>
          <input
            type="text"
            name="skills"
            className="form-control mb-2"
            placeholder="Skills"
            value={profile.skills || ''}
            onChange={handleChange}
          />
          <div className="d-flex m-3">
            <label className="form-label fw-bold me-5">Role</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  name="role"
                  value="jobseeker"
                  checked={profile.role === 'jobseeker'}
                  onChange={handleChange}
                  className="form-check-input"
                  id="jobseeker"
                  required
                />
                <label htmlFor="jobseeker" className="form-check-label">Job Seeker</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  name="role"
                  value="jobprovider"
                  checked={profile.role === 'jobprovider'}
                  onChange={handleChange}
                  className="form-check-input"
                  id="jobprovider"
                  required
                />
                <label htmlFor="jobprovider" className="form-check-label">Job Provider</label>
              </div>
            </div>
          </div>
          <h6 className="fw-bold mt-3">Education</h6>
          <input
            type="text"
            name="degree"
            className="form-control mb-2"
            placeholder="Degree"
            value={profile.education?.degree || ''}
            onChange={(e) => handleNestedChange(e, 'education')}
          />
          <input
            type="text"
            name="school"
            className="form-control mb-2"
            placeholder="School"
            value={profile.education?.school || ''}
            onChange={(e) => handleNestedChange(e, 'education')}
          />
          <h6 className="fw-bold mt-3">Work Experience</h6>
          <input
            type="text"
            name="jobTitle"
            className="form-control mb-2"
            placeholder="Job Title"
            value={profile.workExperience?.jobTitle || ''}
            onChange={(e) => handleNestedChange(e, 'workExperience')}
          />
          <input
            type="text"
            name="company"
            className="form-control mb-2"
            placeholder="Company"
            value={profile.workExperience?.company || ''}
            onChange={(e) => handleNestedChange(e, 'workExperience')}
          />
          <input
            type="text"
            name="duration"
            className="form-control mb-2"
            placeholder="Duration"
            value={profile.workExperience?.duration || ''}
            onChange={(e) => handleNestedChange(e, 'workExperience')}
          />
          <textarea
            name="description"
            className="form-control mb-3"
            placeholder="Description"
            value={profile.workExperience?.description || ''}
            onChange={(e) => handleNestedChange(e, 'workExperience')}
          />
          <input type="file" accept="image/*" className="form-control mb-3" onChange={handleFileChange} />
          <div className="d-flex justify-content-around m-2">
            <button
              type="button"
              className="btn btn-primary m-2"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
            <button
              type="button"
              className="btn btn-warning m-2"
              onClick={() => navigate('/homepage')}
              disabled={loading}
            >
              Homepage
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupProfile;