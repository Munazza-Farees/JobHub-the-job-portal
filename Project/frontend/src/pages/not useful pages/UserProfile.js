import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/profile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: "",
    bio: "",
    profilePicture: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(data);
        setUpdatedUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUpdatedUser({ ...updatedUser, profilePicture: file });
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", updatedUser.name);
      formData.append("email", updatedUser.email);
      formData.append("bio", updatedUser.bio);
      if (updatedUser.profilePicture) {
        formData.append("profilePicture", updatedUser.profilePicture);
      }

      await axios.put("http://localhost:5000/api/users/profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(updatedUser);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <div className="profile-card">
        <img src={user.profilePicture || "/default-avatar.png"} alt="Profile" className="profile-pic" />
        {editMode ? (
          <>
            <input type="text" name="name" value={updatedUser.name} onChange={handleChange} />
            <input type="email" name="email" value={updatedUser.email} onChange={handleChange} />
            <textarea name="bio" value={updatedUser.bio} onChange={handleChange} placeholder="Your Bio"></textarea>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>{user.bio}</p>
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
