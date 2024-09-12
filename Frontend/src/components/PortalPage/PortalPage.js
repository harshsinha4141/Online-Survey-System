import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PortalPage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Portal() {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        email: '',
        password: '',
        phone: '',
        address: ''
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

        const response = await fetch('http://localhost:2000/signin/admindetail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                age: formData.age,
                password: formData.password,
                mobile_no: formData.phone
            })
        });

        const data = await response.json();
        if (!response.ok) {
            toast.error(data.msg);
            return;
        }

        toast.success(`Admin Details Added Successfully. Admin ID: ${data.id}`);

        // Navigate to /id and pass the id as state
        setTimeout(() => navigate('/id', { state: { userId: data.id } }), 5000);
    }

    return (
        <div className='body-form-container'>
            <div className="form-container">
            <h2>Admin Details</h2>
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
                    <label>Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter your address"
                        required
                    />
                </div>
                <div className="button-container">
                    <button type="submit" className="submit-button">Submit</button>
                </div>
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
