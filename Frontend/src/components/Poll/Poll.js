import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Poll.css';

const Poll = () => {
  const [formData, setFormData] = useState({
    adminId: '',
    pollName: '',
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:2000/signin/admindetail/input', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: formData.adminId,
        poll_name: formData.pollName,
        question: formData.question,
        opt1: formData.option1,
        opt2: formData.option2,
        opt3: formData.option3,
        opt4: formData.option4
      })
    });

    const data = await response.json();
    if (!response.ok) {
      toast.error(data.msg);
      return;
    }
    toast.success("Poll Created Successfully");
    setTimeout(() => navigate('/home'), 2000);
  }

  return (
    <div className='container'>
      <div className="form-section">
      <h2>Poll Details</h2>
        <label htmlFor="adminId">Admin ID :</label>
        <input type="text" id="adminId" name="adminId" placeholder="Enter Admin ID" onChange={handleChange} />
        <label htmlFor="pollName">Poll Name :</label>
        <input type="text" id="pollName" name="pollName" placeholder="Enter Poll Name" onChange={handleChange} />
        <label htmlFor="question">Question :</label>
        <input type="text" id="question" name="question" placeholder="Enter Question" onChange={handleChange} />
        
        <div className='option'>
          <div className='option-card'>
            <label>A :</label>
            <input type="text" id="option1" name="option1" placeholder="Enter Option" onChange={handleChange} />
          </div>
          <div className='option-card'>
            <label>B :</label>
            <input type="text" id="option2" name="option2" placeholder="Enter Option" onChange={handleChange} />
          </div>
          <div className='option-card'>
            <label>C :</label>
            <input type="text" id="option3" name="option3" placeholder="Enter Option" onChange={handleChange} />
          </div>
          <div className='option-card'>
            <label>D :</label>
            <input type="text" id="option4" name="option4" placeholder="Enter Option" onChange={handleChange} />
          </div>
        </div>

        <div className="submit-container">
          <button className="submit-button" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <ToastContainer
        position='top-center'
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />
    </div>
  );
}

export default Poll;
