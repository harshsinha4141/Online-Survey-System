import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Voter.css'; // Import your CSS file

function Portal() {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        email: '',
        password: '',
        phone: '',
        question: '',
        answer: ''
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
        const response = await fetch('http://localhost:2000/signin/voterdetail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.name,
                age: formData.age,
                email: formData.email,
                password: formData.password,
                mobile_no: formData.phone,
                ques: formData.question,
                ans: formData.answer
            })
        });
        const data = await response.json();
        if (!response.ok) {
            toast.error(data.msg);
            return;
        }
        toast.success("Voter Details Added Successfully");
        setTimeout(() => navigate('/home'), 2000);
    };

    return (
        <div className='body-voter-name'>
            <div className="voter-form-container">
                <h2>Voter Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Age</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Enter your age"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Question</label>
                        <textarea
                            name="question"
                            value={formData.question}
                            onChange={handleChange}
                            placeholder="Enter the question"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Answer</label>
                        <textarea
                            name="answer"
                            value={formData.answer}
                            onChange={handleChange}
                            placeholder="Enter your answer"
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Submit</button>
                </form>
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
        </div>
    );
}

export default Portal;
