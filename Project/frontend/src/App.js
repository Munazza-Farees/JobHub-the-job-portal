import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoggedinNavbar from "./components/LoggedinNavbar.js";
import About from "./pages/About.js";
import Contact from "./pages/Contact.js";
import Home from "./pages/Mainpage_1.js";
import Login from "./pages/Login";
import SetupProfile from "./pages/SetupProfile";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import Searchpage from "./pages/Searchpage.js";
import JobProviderPage from "./pages/JobProviderPage.js";
import JobListingPage from "./pages/JobListingPage.js";
import JobDetails from "./pages/JobDetails";
import JobApplyPage from "./pages/JobApplypage.js";
import UploadImage from "./components/Uploading pages/UploadImage.js";
import UploadNews from "./components/Uploading pages/UploadNews.js";
import ErrorBoundary from "./pages/ErrorBoundary.js";
import ActivityPage from "./pages/ActivityPage.js";
import ViewProfile from "./pages/ViewProfile.js";
import ApplicationsPage from "./pages/ApplicationsPage.js";
import SavedJobsPage from "./pages/SavedJobsPage.js";
import NewsPage from "./pages/NewsPage.js";

const App = () => {
  const location = useLocation();

  // Show LoggedinNavbar only on specific routes
  const shouldShowNavbar = ["/setupProfile", "/homepage", "/job-provider", "/jobs-list"
    , "/job-apply", "/activities", "/applications", "/saved-jobs", "/news"].includes(location.pathname);

  return (
    <AuthProvider>
      {shouldShowNavbar ? <LoggedinNavbar /> : <Navbar />}
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload-image" element={<UploadImage />} />
          <Route path="/upload-news" element={<UploadNews />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/jobs-list" element={<JobListingPage />} />
          <Route path="/job-provider" element={<JobProviderPage />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setupProfile" element={<SetupProfile />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/search" element={<Searchpage />} />
          <Route path="/job-apply" element={<JobApplyPage />} />
          <Route path="/activities" element={<ActivityPage />} />
          <Route path="/profile/:id" element={<ViewProfile />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/saved-jobs" element={<SavedJobsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </ErrorBoundary>
      <Footer />
    </AuthProvider>
  );
};

const MainApp = () => (
  <Router>
    <App />
  </Router>
);

export default MainApp;