import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Id.css';

function Id() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the userId from the location state
  const userId = location.state?.userId || 'No ID Available';

  const handleNext = () => {
    navigate('/poll');
  };

  return (
    <div className="id-container">
      <div className="content">
        <h1>Welcome to Survey Poll</h1>
        <p>Your ID: {userId}</p>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}

export default Id;
