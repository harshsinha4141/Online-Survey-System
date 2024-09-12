import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [allSurveys, setAllSurveys] = useState([]);
  const [displayedSurveys, setDisplayedSurveys] = useState([]);

  useEffect(() => {
    // Fetch the survey data from the JSON file
    fetch("http://localhost:2000/fetchAllQuestions")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched survey data:", data); // Log fetched data
        setAllSurveys(data);
        setDisplayedSurveys(data);
      })
      .catch((error) => console.error("Error fetching survey data:", error));
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredSurveys = allSurveys.filter(
      (survey) =>
        survey.poll_name.toLowerCase().includes(searchTerm) ||
        survey.question.toLowerCase().includes(searchTerm)
    );
    setDisplayedSurveys(filteredSurveys);
  };

  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="navbar-logo">
          <h2>Survey Vortex</h2>
        </div>
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search surveys..."
            onChange={handleSearch}
            className="search-bar"
          />
        </div>
        <div className="navbar-buttons">
          <button
            onClick={() => navigate("/")}
            className="portal-button"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="main">
        <div className="main-profile">
          <div className="profile-head">
            <div className="profile"></div>
            <div>
              <h3>Harsh Sinha</h3>
              <h4>harshsinha@gmail.com</h4>
            </div>
          </div>
          <div className="profile-mid">
            <h2 onClick={() => navigate("/admin-portal")}>Create Poll</h2>
            <h2>Create Poll History</h2>
            <h2>Vote Poll History</h2>
            <h2 onClick={() => navigate("/updatePassword")}>Update Password</h2>
            <h2>About Us</h2>
            <h2>Setting</h2>
          </div>
        </div>
        <div className="home-header-parent">
          <header className="home-header">
            <h1>Welcome to the Survey Vortex</h1>
            <p>One Nation One Survey!!</p>
          </header>
          <section className="survey-cards">
            {displayedSurveys.length > 0 ? (
              displayedSurveys.map((survey) => (
                <div key={survey.question} className="survey-card">
                  <h3>{survey.poll_name}</h3>
                  <p>Q: {survey.question}</p>
                  <p>A: {survey.opt1}</p>
                  <p>B: {survey.opt2}</p>
                  <p>C: {survey.opt3}</p>
                  <p>D: {survey.opt4}</p>
                  <div className="card-actions">
                    <button onClick={() => navigate(`/voter`)}>
                      Vote
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No surveys found.</p>
            )}
          </section>
        </div>
      </div>
      <footer className="home-footer">
        <p>&copy; 2024 Survey System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
